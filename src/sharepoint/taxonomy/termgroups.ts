"use strict";

import { QueryableTaxonomy } from "./QueryableTaxonomy";
import { TermGroup } from "./TermGroup";

/**
 * Root of the SharePoint TermGroups module
 */
export class TermGroups extends QueryableTaxonomy {
    private identifier: string;

     /**
     * Creates a new instance of the TermGroups class
     */
    constructor(identifier?: string) {
        super("SP.Taxonomy.TermGroup");
        this.identifier = identifier;
    }

    /**
     * Gets a Term Group from the collection by title
     *
     * @param title The title of the Term Group
     */
    public getByTitle(title: string): TermGroup {
        return new TermGroup(title);
    }

    /**
     * Gets a Term Group from the collection by guid id
     *
     * @param title The Id of the list
     */
    public getById(id: string): TermGroup {
        return new TermGroup(id);
    }

    public get(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.taxSession.getDefaultSiteCollectionTermStore(this.clientContext).then(defaultTermStore => {
                this.clientObjects = defaultTermStore.get_groups();
                this.taxSession.retrieveObjects(this.clientContext, this).then(resolve, reject);
            });
        });
    }
};
