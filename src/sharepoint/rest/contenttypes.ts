"use strict";

import { Queryable, QueryableCollection, QueryableInstance } from "./Queryable";

/**
 * Describes a collection of content types
 * 
 */
export class ContentTypes extends QueryableCollection {

    /**
     * Creates a new instance of the ContentTypes class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this content types collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "contentTypes");
    }

    /**
     * Gets a ContentType by content type id
     */
    public getById(id: string): ContentType {
        return new ContentType(this.toUrl().concat(`('${id}')`));
    }
}

/**
 * Describes a single ContentType instance
 * 
 */
export class ContentType extends QueryableInstance {

    /**
     * Creates a new instance of the ContentType class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this content type instance
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl);
    }
}
