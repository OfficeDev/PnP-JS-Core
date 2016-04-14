"use strict";

import { Queryable, QueryableCollection } from "./Queryable";

/**
 * Describes a set of role assignments for the current scope
 * 
 */
export class RoleAssignments extends QueryableCollection {

    /**
     * Creates a new instance of the RoleAssignments class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "RoleAssignments");
    }
}
