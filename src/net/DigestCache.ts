"use strict";

import { Dictionary } from "../collections/collections";
import { HttpClient } from "./httpClient";
import { Util } from "../utils/util";

export class CachedDigest {
    public expiration: Date;
    public value: string;
}

export class DigestCache {

    constructor(private _httpClient: HttpClient, private _digests: Dictionary<CachedDigest> = new Dictionary<CachedDigest>()) { }

    public getDigest(webUrl: string): Promise<string> {
        let self = this;

        let cachedDigest: CachedDigest = this._digests.get(webUrl);
        if (cachedDigest !== null) {
            let now = new Date();
            if (now < cachedDigest.expiration) {
                return Promise.resolve(cachedDigest.value);
            }
        }

        let url = Util.combinePaths(webUrl, "/_api/contextinfo");

        return self._httpClient.fetchRaw(url, {
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json;odata=verbose;charset=utf-8",
            },
            method: "POST",
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            let newCachedDigest = new CachedDigest();
            newCachedDigest.value = data.FormDigestValue;
            let seconds = data.FormDigestTimeoutSeconds;
            let expiration = new Date();
            expiration.setTime(expiration.getTime() + 1000 * seconds);
            newCachedDigest.expiration = expiration;
            self._digests.add(webUrl, newCachedDigest);
            return newCachedDigest.value;
        });
    }

    public clear() {
        this._digests.clear();
    }
}

