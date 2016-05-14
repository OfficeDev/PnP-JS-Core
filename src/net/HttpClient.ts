"use strict";

import { FetchClient } from "./fetchClient";
import { DigestCache } from "./digestCache";
import { Util } from "../utils/util";

export class HttpClient {

    constructor(private _impl = new FetchClient()) {
        this._digestCache = new DigestCache(this);
    }

    private _digestCache: DigestCache;

    public fetch(url: string, options: any = {}): Promise<Response> {

        let self = this;

        let opts = Util.extend(options, { cache: "no-cache", credentials: "same-origin" }, true);

        let headers = new Headers();

        if (typeof options.headers !== "undefined") {
            let temp = <any>new Request("", { headers: options.headers });
            temp.headers.forEach(function (value, name) {
                headers.append(name, value);
            });
        }

        if (!headers.has("Accept")) {
            headers.append("Accept", "application/json");
        }

        if (!headers.has("Content-type")) {
            headers.append("Content-Type", "application/json;odata=verbose;charset=utf-8");
        }

        if (!headers.has("X-ClientService-ClientTag")) {
            headers.append("X-ClientService-ClientTag", "SharePoint.PnP.JavaScriptCore");
        }

        opts = Util.extend(opts, { headers: headers });

        if (opts.method && opts.method.toUpperCase() !== "GET") {
            if (!headers.has("X-RequestDigest")) {
                let index = url.indexOf("/_api/");
                if (index < 0) {
                    throw new Error("Unable to determine API url");
                }
                let webUrl = url.substr(0, index);
                return this._digestCache.getDigest(webUrl)
                    .then(function (digest) {
                        headers.append("X-RequestDigest", digest);
                        return self.fetchRaw(url, opts);
                    });
            }
        }

        return self.fetchRaw(url, opts);
    }

    public fetchRaw(url: string, options: any = {}): Promise<Response> {

        let retry = (ctx): void => {

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

            let retryContext = {
                attempts: 0,
                delay: 100,
                reject: reject,
                resolve: resolve,
                retryCount: 7,
            };

            retry.call(this, retryContext);
        });
    }

    public get(url: string, options: any = {}): Promise<Response> {
        let opts = Util.extend(options, { method: "GET" });
        return this.fetch(url, opts);
    }

    public post(url: string, options: any = {}): Promise<Response> {
        let opts = Util.extend(options, { method: "POST" });
        return this.fetch(url, opts);
    }
}

export interface HttpClientImpl {
    fetch(url: string, options: any): Promise<Response>;
}
