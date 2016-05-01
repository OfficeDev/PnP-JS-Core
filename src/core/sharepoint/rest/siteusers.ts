"use strict";

import { Queryable, QueryableCollection } from "./Queryable";

/**
 * Describes a collection of site users
 * 
 */
export class SiteUsers extends QueryableCollection {

    /**
     * Creates a new instance of the SiteUsers class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "siteusers");
    }
}
