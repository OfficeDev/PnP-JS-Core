"use strict";

import { QueryableTaxonomy } from "./QueryableTaxonomy";
import { TermSets } from "./TermSets";
import { Util } from "../../utils/util";

/**
 * Root of the SharePoint TermGroups module
 */
export class TermGroup extends QueryableTaxonomy {
    private identifier: string;

    /**
     * Creates a new instance of the TermGroup class
     */
    constructor(identifier: string) {
        super("SP.Taxonomy.TermGroup");
        this.identifier = identifier;
    }

    /**
     * Gets a Term Group from the collection by title
     *
     * @param title The title of the Term Group
     */
    public termsets(): TermSets {
        return new TermSets(this.identifier);
    }

    public get(): Promise<any> {
        return new Promise((resolve, reject) => {
            const clientContext = SP.ClientContext.get_current();
            this.taxSession.getDefaultSiteCollectionTermStore(clientContext).then(defaultTermStore => {
                let groups = defaultTermStore.get_groups();
                this.clientObjects = Util.isValidGUID(this.identifier) ?
                    groups.getById(new SP.Guid(this.identifier)) :
                    groups.getByName(this.identifier);
                this.taxSession.retrieveObjects(clientContext, this).then(resolve, reject);
            });
        });
    }
};
