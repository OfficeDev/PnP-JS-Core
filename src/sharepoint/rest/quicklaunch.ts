"use strict";

import { Queryable } from "./Queryable";

/**
 * Describes the quick launch navigation
 * 
 */
export class QuickLaunch extends Queryable {

    /**
     * Creates a new instance of the Lists class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "QuickLaunch");
    }
}
