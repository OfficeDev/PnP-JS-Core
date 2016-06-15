"use strict";

import { TaxonomySession } from "./TaxonomySession";
import { TermGroup } from "./TermGroup";

/**
 * Root of the SharePoint TermGroups module
 */
export class TermGroups {
    private taxSession: TaxonomySession = new TaxonomySession();
    private identifier: string;

    constructor(identifier?: string) {
        this.identifier = identifier;
    }

    /**
     * Gets a Term Group from the collection by title
     *
     * @param title The title of the Term Group
     */
    public getByTitle(title: string): TermGroups {
        return new TermGroup(title);
    }

    /**
     * Gets a Term Group from the collection by guid id
     *
     * @param title The Id of the list
     */
    public getById(id: string): List {
        return new TermGroup(id);
    }

    public get(): Promise<any> {
        return new Promise((resolve, reject) => {
            const clientContext = SP.ClientContext.get_current();
            this.taxSession.getDefaultSiteCollectionTermStore(clientContext).then(defaultTermStore => {
                this.taxSession.retrieveObjects(clientContext, defaultTermStore.get_groups()).then(resolve, reject);
            });
        });
    }
};
