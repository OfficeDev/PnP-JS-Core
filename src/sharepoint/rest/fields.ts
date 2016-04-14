"use strict";

import { Queryable, QueryableCollection, QueryableInstance } from "./queryable";

/**
 * Describes a collection of Field objects
 * 
 */
export class Fields extends QueryableCollection {

    /**
     * Creates a new instance of the Fields class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "fields");
    }
}


/**
 * Describes a single of Field instance
 * 
 */
export class Field extends QueryableInstance {

    /**
     * Creates a new instance of the Field class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this field instance
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl);
    }
}
