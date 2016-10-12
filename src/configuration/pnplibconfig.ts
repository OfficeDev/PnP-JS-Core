"use strict";

import { TypedHash } from "../collections/collections";
import {IAuthOptions} from "node-sp-auth";

declare var global: any;

export interface NodeClientData {
    siteUrl: string;
    credentials: IAuthOptions;
}

export interface LibraryConfiguration {

    /**
     * Any headers to apply to all requests
     */
    headers?: TypedHash<string>;

    /**
     * Allows caching to be global disabled, default: false
     */
    globalCacheDisable?: boolean;

    /**
     * Defines the default store used by the usingCaching method, default: session
     */
    defaultCachingStore?: "session" | "local";

    /**
     * Defines the default timeout in seconds used by the usingCaching method, default 30
     */
    defaultCachingTimeoutSeconds?: number;

    /**
     * If true the SP.RequestExecutor will be used to make the requests, you must include the required external libs
     */
    useSPRequestExecutor?: boolean;

    /**
     * If set the library will use node-fetch, typically for use with testing but works with any valid client id/secret pair
     */
    nodeClientOptions?: NodeClientData;
}

export class RuntimeConfigImpl {

    private _headers: TypedHash<string>;
    private _defaultCachingStore: "session" | "local";
    private _defaultCachingTimeoutSeconds: number;
    private _globalCacheDisable: boolean;
    private _useSPRequestExecutor: boolean;
    private _useNodeClient: boolean;
    private _nodeClientData: NodeClientData;

    constructor() {
        // these are our default values for the library
        this._headers = null;
        this._defaultCachingStore = "session";
        this._defaultCachingTimeoutSeconds = 30;
        this._globalCacheDisable = false;
        this._useSPRequestExecutor = false;
    }

    public set(config: LibraryConfiguration): void {

        if (config.hasOwnProperty("headers")) {
            this._headers = config.headers;
        }

        if (config.hasOwnProperty("globalCacheDisable")) {
            this._globalCacheDisable = config.globalCacheDisable;
        }

        if (config.hasOwnProperty("defaultCachingStore")) {
            this._defaultCachingStore = config.defaultCachingStore;
        }

        if (config.hasOwnProperty("defaultCachingTimeoutSeconds")) {
            this._defaultCachingTimeoutSeconds = config.defaultCachingTimeoutSeconds;
        }

        if (config.hasOwnProperty("useSPRequestExecutor")) {
            this._useSPRequestExecutor = config.useSPRequestExecutor;
        }

        if (config.hasOwnProperty("nodeClientOptions")) {
            this._useNodeClient = true;
            this._useSPRequestExecutor = false; // just don't allow this conflict
            this._nodeClientData = config.nodeClientOptions;
            // this is to help things work when running in node.js, specifically batching
            // we shim the _spPageContextInfo object
            global._spPageContextInfo = {
                webAbsoluteUrl: config.nodeClientOptions.siteUrl,
            };
        }
    }

    public get headers(): TypedHash<string> {
        return this._headers;
    }

    public get defaultCachingStore(): "session" | "local" {
        return this._defaultCachingStore;
    }

    public get defaultCachingTimeoutSeconds(): number {
        return this._defaultCachingTimeoutSeconds;
    }

    public get globalCacheDisable(): boolean {
        return this._globalCacheDisable;
    }

    public get useSPRequestExecutor(): boolean {
        return this._useSPRequestExecutor;
    }

    public get useNodeFetchClient(): boolean {
        return this._useNodeClient;
    }

    public get nodeRequestOptions(): NodeClientData {
        return this._nodeClientData;
    }
}

let _runtimeConfig = new RuntimeConfigImpl();

export let RuntimeConfig = _runtimeConfig;

export function setRuntimeConfig(config: LibraryConfiguration): void {
    _runtimeConfig.set(config);
}
