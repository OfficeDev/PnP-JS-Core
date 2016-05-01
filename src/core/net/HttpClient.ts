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
        return this._impl.fetch(url, options);
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
