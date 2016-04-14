"use strict";

import { QueryableInstance } from "./Queryable";
import { Web } from "./webs";

/**
 * Describes a site collection
 * 
 */
export class Site extends QueryableInstance {

    /**
     * Creates a new instance of the RoleAssignments class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string) {
        super(baseUrl, "site");
    }

    /**
     * Gets the root web of the site collection
     * 
     */
    public get rootWeb(): Web {
        return new Web(this, "rootweb");
    }
}
