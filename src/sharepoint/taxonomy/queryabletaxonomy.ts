"use strict";

import { TaxonomySession } from "./TaxonomySession";

/**
 * QueryableTaxonomy Base Class
 *
 */
export class QueryableTaxonomy {
    public taxSession: TaxonomySession;
    public clientContext: SP.ClientContext;
    public type: string;
    public clientObjects: any;

    /**
     * Creates a new instance of the QueryableTaxonomy class
     *
     * @param type The type of the QueryableTaxonomy
     */
    constructor(type: string) {
        this.taxSession = new TaxonomySession();
        this.clientContext = SP.ClientContext.get_current();
        this.type = type;
    }
};
