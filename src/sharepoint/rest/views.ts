"use strict";

import { Queryable, QueryableCollection, QueryableInstance } from "./Queryable";

/**
 * Describes the views available in the current context
 * 
 */
export class Views extends QueryableCollection {

    /**
     * Creates a new instance of the Views class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "views");
    }

    /**
     * Gets a view by guid id
     * 
     * @param id The GUID id of the view
     */
    public getById(id: string): View {
        this.concat(`(guid'${id}')`);
        return new View(this);
    }
}


/**
 * Describes a single View instance
 * 
 */
export class View extends QueryableInstance {

    /**
     * Creates a new instance of the View class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl);
    }
}
