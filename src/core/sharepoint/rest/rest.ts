"use strict";

import { Search, SearchQuery, SearchResult } from "./search";
import { Site } from "./site";
import { Web } from "./webs";
import { Util } from "../../utils/util";
import { Queryable } from "./queryable";
import { UserProfileQuery } from "./userprofiles";

/**
 * Root of the SharePoint REST module
 */
export class Rest {


    /**
     * Executes a search against this web context
     *
     * @param query The SearchQuery definition
     */
    public search(query: SearchQuery): Promise<SearchResult> {
        return new Search("_api/search", query).execute().then(function(results) {
            return results;
        });
    }

    /**
     * Begins a site collection scoped REST request
     *
     */
    public get site(): Site {
        return new Site("_api", "site");
    }

    /**
     * Begins a web scoped REST request
     *
     */
    public get web(): Web {
        return new Web("_api", "web");
    }

    /**
     * Access to user profile methods
     *
     */
    public get profiles(): UserProfileQuery {
        return new UserProfileQuery("_api");
    }

    /**
     * Begins a cross-domain, host site scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    public crossDomainSite(addInWebUrl: string, hostWebUrl: string): Site {
        return this._cdImpl<Site>(Site, addInWebUrl, hostWebUrl, "site");
    }

    /**
     * Begins a cross-domain, host web scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    public crossDomainWeb(addInWebUrl: string, hostWebUrl: string): Web {
        return this._cdImpl<Web>(Web, addInWebUrl, hostWebUrl, "web");
    }

    /**
     * Implements the creation of cross domain REST urls
     *
     * @param factory The constructor of the object to create Site | Web
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     * @param urlPart String part to append to the url "site" | "web"
     */
    private _cdImpl<T extends Queryable>(factory: { new (s: string): T }, addInWebUrl: string, hostWebUrl: string, urlPart: string): T {

        if (!Util.isUrlAbsolute(addInWebUrl)) {
            throw "The addInWebUrl parameter must be an absolute url.";
        }

        if (!Util.isUrlAbsolute(hostWebUrl)) {
            throw "The hostWebUrl parameter must be an absolute url.";
        }

        let url = Util.combinePaths(addInWebUrl, "_api/SP.AppContextSite(@target)", urlPart);

        let instance = new factory(url);
        instance.query.add("@target", encodeURIComponent(hostWebUrl));
        return instance;
    }
}
