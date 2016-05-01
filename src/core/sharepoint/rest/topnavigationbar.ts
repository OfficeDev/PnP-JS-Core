"use strict";

import { Queryable, QueryableInstance } from "./Queryable";

/**
 * Describes the top navigation on the site
 * 
 */
export class TopNavigationBar extends QueryableInstance {

    /**
     * Creates a new instance of the SiteUsers class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "TopNavigationBar");
    }
}
