"use strict";

import { Util } from "../../utils/util";
import { Dictionary } from "../../collections/collections";
import { FetchOptions, HttpClient } from "../../net/HttpClient";
import { ODataParser, ODataDefaultParser, ODataBatch } from "./odata";
import { ICachingOptions, CachingParserWrapper, CachingOptions } from "./caching";
import { RuntimeConfig } from "../../configuration/pnplibconfig";

declare var _spPageContextInfo: any;

export interface QueryableConstructor<T> {
    new (baseUrl: string | Queryable, path?: string): T;
}

/**
 * Queryable Base Class
 *
 */
export class Queryable {

    /**
     * Creates a new instance of the Queryable class
     *
     * @constructor
     * @param baseUrl A string or Queryable that should form the base part of the url
     *
     */
    constructor(baseUrl: string | Queryable, path?: string) {

        this._query = new Dictionary<string>();
        this._batch = null;

        if (typeof baseUrl === "string") {
            // we need to do some extra parsing to get the parent url correct if we are
            // being created from just a string.

            let urlStr = baseUrl as string;
            if (urlStr.lastIndexOf("/") < 0) {
                this._parentUrl = urlStr;
                this._url = Util.combinePaths(urlStr, path);
            } else if (urlStr.lastIndexOf("/") > urlStr.lastIndexOf("(")) {
                let index = urlStr.lastIndexOf("/");
                this._parentUrl = urlStr.slice(0, index);
                path = Util.combinePaths(urlStr.slice(index), path);
                this._url = Util.combinePaths(this._parentUrl, path);
            } else {
                let index = urlStr.lastIndexOf("(");
                this._parentUrl = urlStr.slice(0, index);
                this._url = Util.combinePaths(urlStr, path);
            }
        } else {
            let q = baseUrl as Queryable;
            this._parentUrl = q._url;
            // only copy batch if we don't already have one
            if (!this.hasBatch && q.hasBatch) {
                this._batch = q._batch;
            }
            let target = q._query.get("@target");
            if (target !== null) {
                this._query.add("@target", target);
            }
            this._url = Util.combinePaths(this._parentUrl, path);
        }
    }

    /**
     * Tracks the query parts of the url
     */
    protected _query: Dictionary<string>;

    /**
     * Tracks the batch of which this query may be part
     */
    private _batch: ODataBatch;

    /**
     * Tracks the url as it is built
     */
    private _url: string;

    /**
     * Stores the parent url used to create this instance, for recursing back up the tree if needed
     */
    private _parentUrl: string;

    /**
     * Explicitly tracks if we are using caching for this request
     */
    private _useCaching: boolean;

    /**
     * Any options that were supplied when caching was enabled
     */
    private _cachingOptions: ICachingOptions;

    /**
     * Directly concatonates the supplied string to the current url, not normalizing "/" chars
     *
     * @param pathPart The string to concatonate to the url
     */
    public concat(pathPart: string) {
        this._url += pathPart;
    }

    /**
     * Appends the given string and normalizes "/" chars
     *
     * @param pathPart The string to append
     */
    protected append(pathPart: string) {
        this._url = Util.combinePaths(this._url, pathPart);
    }

    /**
     * Blocks a batch call from occuring, MUST be cleared with clearBatchDependency before a request will execute
     */
    protected addBatchDependency() {
        if (this._batch !== null) {
            this._batch.incrementBatchDep();
        }
    }

    /**
     * Clears a batch request dependency
     */
    protected clearBatchDependency() {
        if (this._batch !== null) {
            this._batch.decrementBatchDep();
        }
    }

    /**
     * Indicates if the current query has a batch associated
     *
     */
    protected get hasBatch(): boolean {
        return this._batch !== null;
    }

    /**
     * Gets the parent url used when creating this instance
     *
     */
    protected get parentUrl(): string {
        return this._parentUrl;
    }

    /**
     * Provides access to the query builder for this url
     *
     */
    public get query(): Dictionary<string> {
        return this._query;
    }

    /**
     * Adds this query to the supplied batch
     * 
     * @example 
     * ```
     * 
     * let b = pnp.sp.createBatch(); 
     * pnp.sp.web.inBatch(b).get().then(...);
     * ```
     */
    public inBatch(batch: ODataBatch): this {
        if (this._batch !== null) {
            // TODO: what do we want to do?
            throw new Error("This query is already part of a batch.");
        }

        this._batch = batch;

        return this;
    }

    /**
     * Enables caching for this request
     * 
     * @param options Defines the options used when caching this request
     */
    public usingCaching(options?: ICachingOptions): this {
        if (!RuntimeConfig.globalCacheDisable) {
            this._useCaching = true;
            this._cachingOptions = options;
        }
        return this;
    }

    /**
     * Gets the currentl url, made server relative or absolute based on the availability of the _spPageContextInfo object
     *
     */
    public toUrl(): string {
        return Util.makeUrlAbsolute(this._url);
    }

    /**
     * Gets the full url with query information
     *
     */
    public toUrlAndQuery(): string {
        let url = this.toUrl();
        if (this._query.count() > 0) {
            url += "?";
            let keys = this._query.getKeys();
            url += keys.map((key, ix, arr) => `${key}=${this._query.get(key)}`).join("&");
        }
        return url;
    }

    /**
     * Executes the currently built request
     *
     */
    public get(parser: ODataParser<any, any> = new ODataDefaultParser(), getOptions: FetchOptions = {}): Promise<any> {
        return this.getImpl(getOptions, parser);
    }

    public getAs<T, U>(parser: ODataParser<T, U> = new ODataDefaultParser(), getOptions: FetchOptions = {}): Promise<U> {
        return this.getImpl(getOptions, parser);
    }

    protected post(postOptions: FetchOptions = {}, parser: ODataParser<any, any> = new ODataDefaultParser()): Promise<any> {
        return this.postImpl(postOptions, parser);
    }

    protected postAs<T, U>(postOptions: FetchOptions = {}, parser: ODataParser<T, U> = new ODataDefaultParser()): Promise<U> {
        return this.postImpl(postOptions, parser);
    }

    /**
     * Gets a parent for this isntance as specified
     *
     * @param factory The contructor for the class to create
     */
    protected getParent<T extends Queryable>(
        factory: { new (q: string | Queryable, path?: string): T },
        baseUrl: string | Queryable = this.parentUrl,
        path?: string): T {

        let parent = new factory(baseUrl, path);
        let target = this.query.get("@target");
        if (target !== null) {
            parent.query.add("@target", target);
        }
        return parent;
    }

    private getImpl<U>(getOptions: FetchOptions = {}, parser: ODataParser<any, U>): Promise<U> {

        if (this._useCaching) {
            let options = new CachingOptions(this.toUrlAndQuery().toLowerCase());
            if (typeof this._cachingOptions !== "undefined") {
                options = Util.extend(options, this._cachingOptions);
            }

            // we may not have a valid store, i.e. on node
            if (options.store !== null) {
                // check if we have the data in cache and if so return a resolved promise
                let data = options.store.get(options.key);
                if (data !== null) {
                    return new Promise(resolve => resolve(data));
                }
            }

            // if we don't then wrap the supplied parser in the caching parser wrapper
            // and send things on their way
            parser = new CachingParserWrapper(parser, options);
        }

        if (this._batch === null) {

            // we are not part of a batch, so proceed as normal
            let client = new HttpClient();
            return client.get(this.toUrlAndQuery(), getOptions).then(function (response) {

                if (!response.ok) {
                    throw "Error making GET request: " + response.statusText;
                }

                return parser.parse(response);
            });
        } else {

            return this._batch.add(this.toUrlAndQuery(), "GET", {}, parser);
        }
    }

    private postImpl<U>(postOptions: FetchOptions, parser: ODataParser<any, U>): Promise<U> {

        if (this._batch === null) {

            // we are not part of a batch, so proceed as normal
            let client = new HttpClient();

            return client.post(this.toUrlAndQuery(), postOptions).then(function (response) {

                // 200 = OK (delete)
                // 201 = Created (create)
                // 204 = No Content (update)
                if (!response.ok) {
                    throw "Error making POST request: " + response.statusText;
                }

                if ((response.headers.has("Content-Length") && parseFloat(response.headers.get("Content-Length")) === 0)
                    || response.status === 204) {

                    // in these cases the server has returned no content, so we create an empty object
                    // this was done because the fetch browser methods throw exceptions with no content
                    return new Promise<any>((resolve, reject) => { resolve({}); });
                }

                // pipe our parsed content
                return parser.parse(response);
            });
        } else {
            return this._batch.add(this.toUrlAndQuery(), "POST", postOptions, parser);
        }
    }
}

/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
export class QueryableCollection extends Queryable {

    /**
     * Filters the returned collection (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#bk_supported)
     * 
     * @param filter The string representing the filter query
     */
    public filter(filter: string): QueryableCollection {
        this._query.add("$filter", filter);
        return this;
    }

    /**
     * Choose which fields to return
     * 
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): QueryableCollection {
        this._query.add("$select", selects.join(","));
        return this;
    }

    /**
     * Expands fields such as lookups to get additional data
     * 
     * @param expands The Fields for which to expand the values
     */
    public expand(...expands: string[]): QueryableCollection {
        this._query.add("$expand", expands.join(","));
        return this;
    }

    /**
     * Orders based on the supplied fields ascending
     * 
     * @param orderby The name of the field to sort on
     * @param ascending If true ASC is appended, otherwise DESC (default)
     */
    public orderBy(orderBy: string, ascending = false): QueryableCollection {
        let keys = this._query.getKeys();
        let query = [];
        let asc = ascending ? " asc" : "";
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === "$orderby") {
                query.push(this._query.get("$orderby"));
                break;
            }
        }
        query.push(`${orderBy}${asc}`);

        this._query.add("$orderby", query.join(","));

        return this;
    }

    /**
     * Skips the specified number of items
     * 
     * @param skip The number of items to skip
     */
    public skip(skip: number): QueryableCollection {
        this._query.add("$skip", skip.toString());
        return this;
    }

    /**
     * Limits the query to only return the specified number of items
     * 
     * @param top The query row limit
     */
    public top(top: number): QueryableCollection {
        this._query.add("$top", top.toString());
        return this;
    }
}


/**
 * Represents an instance that can be selected
 *
 */
export class QueryableInstance extends Queryable {

    /**
     * Choose which fields to return
     * 
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): QueryableInstance {
        this._query.add("$select", selects.join(","));
        return this;
    }

    /**
     * Expands fields such as lookups to get additional data
     * 
     * @param expands The Fields for which to expand the values
     */
    public expand(...expands: string[]): QueryableInstance {
        this._query.add("$expand", expands.join(","));
        return this;
    }
}
