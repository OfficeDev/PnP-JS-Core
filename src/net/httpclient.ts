import { FetchClient } from "./fetchclient";
import { DigestCache } from "./digestcache";
import { Util } from "../utils/util";
import { RuntimeConfig } from "../configuration/pnplibconfig";
import { SPRequestExecutorClient } from "./sprequestexecutorclient";
import { NodeFetchClient } from "./nodefetchclient";
import { APIUrlException } from "../utils/exceptions";

export interface FetchOptions {
    method?: string;
    headers?: HeadersInit | { [index: string]: string };
    body?: BodyInit;
    mode?: string | RequestMode;
    credentials?: string | RequestCredentials;
    cache?: string | RequestCache;
}

export class HttpClient {

    private _digestCache: DigestCache;
    private _impl: HttpClientImpl;

    constructor() {
        this._impl = this.getFetchImpl();
        this._digestCache = new DigestCache(this);
    }

    public fetch(url: string, options: FetchOptions = {}): Promise<Response> {

        let opts = Util.extend(options, { cache: "no-cache", credentials: "same-origin" }, true);

        let headers = new Headers();

        // first we add the global headers so they can be overwritten by any passed in locally to this call
        this.mergeHeaders(headers, RuntimeConfig.headers);

        // second we add the local options so we can overwrite the globals
        this.mergeHeaders(headers, options.headers);

        // lastly we apply any default headers we need that may not exist
        if (!headers.has("Accept")) {
            headers.append("Accept", "application/json");
        }

        if (!headers.has("Content-Type")) {
            headers.append("Content-Type", "application/json;odata=verbose;charset=utf-8");
        }

        if (!headers.has("X-ClientService-ClientTag")) {
            headers.append("X-ClientService-ClientTag", "PnPCoreJS:$$Version$$");
        }

        opts = Util.extend(opts, { headers: headers });

        if (opts.method && opts.method.toUpperCase() !== "GET") {
            if (!headers.has("X-RequestDigest")) {
                let index = url.indexOf("_api/");
                if (index < 0) {
                    throw new APIUrlException();
                }
                let webUrl = url.substr(0, index);
                return this._digestCache.getDigest(webUrl)
                    .then((digest) => {
                        headers.append("X-RequestDigest", digest);
                        return this.fetchRaw(url, opts);
                    });
            }
        }

        return this.fetchRaw(url, opts);
    }

    public fetchRaw(url: string, options: FetchOptions = {}): Promise<Response> {

        // here we need to normalize the headers
        let rawHeaders = new Headers();
        this.mergeHeaders(rawHeaders, options.headers);
        options = Util.extend(options, { headers: rawHeaders });

        let retry = (ctx: RetryContext): void => {

            this._impl.fetch(url, options).then((response) => ctx.resolve(response)).catch((response) => {

                // grab our current delay
                let delay = ctx.delay;

                // Check if request was throttled - http status code 429 
                // Check is request failed due to server unavailable - http status code 503 
                if (response.status !== 429 && response.status !== 503) {
                    ctx.reject(response);
                }

                // Increment our counters.
                ctx.delay *= 2;
                ctx.attempts++;

                // If we have exceeded the retry count, reject.
                if (ctx.retryCount <= ctx.attempts) {
                    ctx.reject(response);
                }

                // Set our retry timeout for {delay} milliseconds.
                setTimeout(Util.getCtxCallback(this, retry, ctx), delay);
            });
        };

        return new Promise((resolve, reject) => {

            let retryContext: RetryContext = {
                attempts: 0,
                delay: 100,
                reject: reject,
                resolve: resolve,
                retryCount: 7,
            };

            retry.call(this, retryContext);
        });
    }

    public get(url: string, options: FetchOptions = {}): Promise<Response> {
        let opts = Util.extend(options, { method: "GET" });
        return this.fetch(url, opts);
    }

    public post(url: string, options: FetchOptions = {}): Promise<Response> {
        let opts = Util.extend(options, { method: "POST" });
        return this.fetch(url, opts);
    }

    public patch(url: string, options: FetchOptions = {}): Promise<Response> {
        let opts = Util.extend(options, { method: "PATCH" });
        return this.fetch(url, opts);
    }

    public delete(url: string, options: FetchOptions = {}): Promise<Response> {
        let opts = Util.extend(options, { method: "DELETE" });
        return this.fetch(url, opts);
    }

    protected getFetchImpl(): HttpClientImpl {
        let opts = RuntimeConfig.nodeRequestOptions;
        if (RuntimeConfig.useSPRequestExecutor) {
            return new SPRequestExecutorClient();
        } else if (RuntimeConfig.useNodeFetchClient && opts && opts.httpClient) {
            return RuntimeConfig.nodeRequestOptions.httpClient;
        } else if (RuntimeConfig.useNodeFetchClient && opts && opts.clientId && opts.clientSecret) {
            return new NodeFetchClient(opts.siteUrl, opts.clientId, opts.clientSecret);
        } else {
            return new FetchClient();
        }
    }

    private mergeHeaders(target: Headers, source: any): void {
        if (typeof source !== "undefined" && source !== null) {
            let temp = <any>new Request("", { headers: source });
            temp.headers.forEach((value: string, name: string) => {
                target.append(name, value);
            });
        }
    }
}

interface RetryContext {
    attempts: number;
    delay: number;
    reject: (reason?: any) => void;
    resolve: (value?: {} | PromiseLike<{}>) => void;
    retryCount: number;
};

export interface HttpClientImpl {
    fetch(url: string, options: any): Promise<Response>;
}
