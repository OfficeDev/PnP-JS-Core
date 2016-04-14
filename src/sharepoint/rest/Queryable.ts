"use strict";

import * as Util from "../../utils/util";
import { Dictionary } from "../../collections/collections";
import { RoleAssignments } from "./roleassignments";
import { HttpClient } from "../../net/HttpClient";

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

        if (typeof baseUrl === "string") {
            this._parentUrl = baseUrl as string;
        } else {
            let q = baseUrl as Queryable;
            this._parentUrl = q._url;
            this._query.merge(q._query);
        }

        this._url = Util.combinePaths(this._parentUrl, path);
    }

    /**
     * Tracks the query parts of the url
     */
    protected _query: Dictionary<string>;

    /**
     * Tracks the url as it is built 
     */
    private _url: string;

    /**
     * Stores the parent url used to create this instance, for recursing back up the tree if needed 
     */
    private _parentUrl: string;

    /**
     * Directly concatonates the supplied string to the current url, not normalizing "/" chars
     * 
     * @param pathPart The string to concatonate to the url
     */
    protected concat(pathPart: string) {
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
     * Provides access to the query builder for this url
     * 
     */
    public get query(): Dictionary<string> {
        return this._query;
    }

    /**
     * Gets the currentl url, made server relative or absolute based on the availability of the _spPageContextInfo object
     * 
     */
    public toUrl(): string {
        if (!Util.isUrlAbsolute(this._url)) {
            if (typeof _spPageContextInfo !== "undefined") {
                if (_spPageContextInfo.hasOwnProperty("webAbsoluteUrl")) {
                    return Util.combinePaths(_spPageContextInfo.webAbsoluteUrl, this._url);
                } else if (_spPageContextInfo.hasOwnProperty("webServerRelativeUrl")) {
                    return Util.combinePaths(_spPageContextInfo.webServerRelativeUrl, this._url);
                }
            }
        }

        return this._url;
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
    public get(parser: (r: Response) => Promise<any> = (r) => r.json()): Promise<any> {
        let client = new HttpClient();
        return client.get(this.toUrlAndQuery()).then(function(response) {

            if (!response.ok) {
                throw "Error making GET request: " + response.statusText;
            }

            return parser(response);

        }).then(function(parsed) {
            return parsed.hasOwnProperty("d") ? parsed.d.hasOwnProperty("results") ? parsed.d.results : parsed.d : parsed;
        });
    }

    protected post(postOptions: any = {}, parser: (r: Response) => Promise<any> = (r) => r.json()): Promise<any> {

        let client = new HttpClient();

        return client.post(this.toUrlAndQuery(), postOptions).then(function(response) {

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
            return parser(response);

        }).then(function(parsed) {

            // try and return the "data" portion of the response
            return parsed.hasOwnProperty("d") ? parsed.d.hasOwnProperty("results") ? parsed.d.results : parsed.d : parsed;
        });
    }
}

/**
 * Represents a REST collection which can be filtered, paged, and selected
 * 
 */
export class QueryableCollection extends Queryable {

    public top(pageSize: number): any {
        this._query.add("$top", pageSize.toString());
        return this;
    }

    public skip(pageStart: number): any {
        this._query.add("$skip", pageStart.toString());
        return this;
    }

    public filter(filter: string): any {
        this._query.add("$filter", filter);
        return this;
    }

    public select(...selects: string[]): any {
        this._query.add("$select", selects.join(","));
        return this;
    }

}


/**
 * Represents an instance that can be selected
 * 
 */
export class QueryableInstance extends Queryable {

    public select(...selects: string[]): any {
        this._query.add("$select", selects.join(","));
        return this;
    }
}

export class QueryableSecurable extends QueryableInstance {

    /**
     * Gets the set of role assignments for this item
     * 
     */
    public get roleAssignments(): RoleAssignments {
        return new RoleAssignments(this);
    }

    /**
     * Gets the closest securable up the security hierarchy whose permissions are applied to this list item
     * 
     */
    public get firstUniqueAncestorSecurableObject(): QueryableInstance {
        this.append("FirstUniqueAncestorSecurableObject");
        return new QueryableInstance(this);
    }

    /**
     * Gets the effective permissions for the user supplied
     * 
     * @param loginName The claims username for the user (ex: i:0#.f|membership|user@domain.com)
     */
    public getUserEffectivePermissions(loginName: string): Queryable {
        this.append("getUserEffectivePermissions(@user)");
        this._query.add("@user", "'" + encodeURIComponent(loginName) + "'");
        return new Queryable(this);
    }

    /**
     * Breaks the security inheritance at this level optinally copying permissions and clearing subscopes
     * 
     * @param copyRoleAssignments If true the permissions are copied from the current parent scope
     * @param clearSubscopes Optional. true to make all child securable objects inherit role assignments from the current object
     */
    public breakRoleInheritance(copyRoleAssignments = false, clearSubscopes = false): Promise<any> {

        class Breaker extends Queryable {
            constructor(baseUrl: string | Queryable, copy: boolean, clear: boolean) {
                super(baseUrl, `breakroleinheritance(copyroleassignments=${copy}, clearsubscopes=${clear})`);
            }

            public break(): Promise<any> {
                return this.post();
            }
        }

        let b = new Breaker(this, copyRoleAssignments, clearSubscopes);
        return b.break();
    }

    /**
     * Breaks the security inheritance at this level optinally copying permissions and clearing subscopes
     * 
     */
    public resetRoleInheritance(): Promise<any> {

        class Resetter extends Queryable {
            constructor(baseUrl: string | Queryable) {
                super(baseUrl, "resetroleinheritance");
            }

            public reset(): Promise<any> {
                return this.post();
            }
        }

        let r = new Resetter(this);
        return r.reset();
    }
}
