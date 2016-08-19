"use strict";

import { ODataParser } from "./odata";
import { PnPClientStore, PnPClientStorage } from "../../utils/storage";
import { Util } from "../../utils/util";
import { RuntimeConfig } from "../../configuration/pnplibconfig";

export interface ICachingOptions {
    expiration?: Date;
    storeName?: "session" | "local";
    key: string;
}

export class CachingOptions implements ICachingOptions {

    constructor(public key: string) { }

    protected static storage = new PnPClientStorage();

    public expiration = Util.dateAdd(new Date(), "second", RuntimeConfig.defaultCachingTimeoutSeconds);

    public storeName: "session" | "local" = RuntimeConfig.defaultCachingStore;

    public get store(): PnPClientStore {
        if (this.storeName === "local") {
            return CachingOptions.storage.local;
        } else {
            return CachingOptions.storage.session;
        }
    }
}

export class CachingParserWrapper<T, U> implements ODataParser<T, U> {

    constructor(
        private _parser: ODataParser<T, U>,
        private _cacheOptions: CachingOptions) { }

    public parse(response: Response): Promise<U> {

        // add this to the cache based on the options
        return this._parser.parse(response).then(data => {

            if (this._cacheOptions.store !== null) {
                this._cacheOptions.store.put(this._cacheOptions.key, data, this._cacheOptions.expiration);
            }

            return data;
        });
    }
}
