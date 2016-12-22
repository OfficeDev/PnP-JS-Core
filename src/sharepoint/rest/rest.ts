"use strict";

import { Search, SearchQuery, SearchResults } from "./search";
import { SearchSuggest, SearchSuggestQuery, SearchSuggestResult } from "./searchsuggest";
import { Site } from "./site";
import { Web } from "./webs";
import { Util } from "../../utils/util";
import { Queryable } from "./queryable";
import { UserProfileQuery } from "./userprofiles";
import { ODataBatch } from "./odata";

/**
 * Root of the SharePoint REST module
 */
export class Rest {

    /**
     * Executes a search against this web context
     *
     * @param query The SearchQuery definition
     */
    public searchSuggest(query: string | SearchSuggestQuery): Promise<SearchSuggestResult> {

        let finalQuery: SearchSuggestQuery;

        if (typeof query === "string") {
            finalQuery = { querytext: query };
        } else {
            finalQuery = query;
        }

        return new SearchSuggest("").execute(finalQuery);
    }

    /**
     * Executes a search against this web context
     *
     * @param query The SearchQuery definition
     */
    public search(query: string | SearchQuery): Promise<SearchResults> {

        let finalQuery: SearchQuery;

        if (typeof query === "string") {
            finalQuery = { Querytext: query };
        } else {
            finalQuery = query;
        }

        return new Search("").execute(finalQuery);
    }

    /**
     * Begins search query fluent method
     *
     * @param query The SearchQuery definition
     */
    public searchAdv(query: string | SearchQuery): Search {
        let search = new Search("");
        search.setQuery(query);

        return search;
    }

    /**
     * Begins a site collection scoped REST request
     *
     */
    public get site(): Site {
        return new Site("");
    }

    /**
     * Begins a web scoped REST request
     *
     */
    public get web(): Web {
        return new Web("");
    }

    /**
     * Access to user profile methods
     *
     */
    public get profiles(): UserProfileQuery {
        return new UserProfileQuery("");
    }

    /**
     * Creates a new batch object for use with the Queryable.addToBatch method
     * 
     */
    public createBatch(): ODataBatch {
        return this.web.createBatch();
    }

    /**
     * Begins a cross-domain, host site scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    public crossDomainSite(addInWebUrl: string, hostWebUrl: string): Site {
        return this._cdImpl(Site, addInWebUrl, hostWebUrl, "site");
    }

    /**
     * Begins a cross-domain, host web scoped REST request, for use in add-in webs
     *
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     */
    public crossDomainWeb(addInWebUrl: string, hostWebUrl: string): Web {
        return this._cdImpl(Web, addInWebUrl, hostWebUrl, "web");
    }

    /**
     * Implements the creation of cross domain REST urls
     *
     * @param factory The constructor of the object to create Site | Web
     * @param addInWebUrl The absolute url of the add-in web
     * @param hostWebUrl The absolute url of the host web
     * @param urlPart String part to append to the url "site" | "web"
     */
    private _cdImpl<T extends Queryable>(
        factory: { new (s: string, p: string): T },
        addInWebUrl: string,
        hostWebUrl: string,
        urlPart: string): T {

        if (!Util.isUrlAbsolute(addInWebUrl)) {
            throw "The addInWebUrl parameter must be an absolute url.";
        }

        if (!Util.isUrlAbsolute(hostWebUrl)) {
            throw "The hostWebUrl parameter must be an absolute url.";
        }

        let url = Util.combinePaths(addInWebUrl, "_api/SP.AppContextSite(@target)");

        let instance = new factory(url, urlPart);
        instance.query.add("@target", "'" + encodeURIComponent(hostWebUrl) + "'");
        return instance;
    }
}
