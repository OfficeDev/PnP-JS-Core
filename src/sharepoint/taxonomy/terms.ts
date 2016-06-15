"use strict";

import { QueryableTaxonomy } from "./QueryableTaxonomy";
import { Util } from "../../utils/util";

/**
 * Root of the SharePoint Taxonomy module
 */
export class Terms extends QueryableTaxonomy {
    private groupIdentifier: string;
    private identifier: string;
    private func: string;

    /**
     * Creates a new instance of the Terms class
     */
    constructor(groupIdentifier: string, identifier: string, func?: string) {
        super("SP.Taxonomy.Term");
        this.groupIdentifier = groupIdentifier;
        this.identifier = identifier;
        this.func = func;
    }

    public get(): Promise<any> {
        return new Promise((resolve, reject) => {
            const clientContext = SP.ClientContext.get_current();
            this.taxSession.getDefaultSiteCollectionTermStore(clientContext).then(defaultTermStore => {
                let groups = defaultTermStore.get_groups();
                let group = Util.isValidGUID(this.groupIdentifier) ?
                    groups.getById(new SP.Guid(this.groupIdentifier)) :
                    groups.getByName(this.groupIdentifier);
                let termSets = group.get_termSets();
                let termSet = Util.isValidGUID(this.identifier) ?
                    termSets.getById(new SP.Guid(this.identifier)) :
                    termSets.getByName(this.identifier);
                this.clientObjects = termSet[this.func]();
                this.taxSession.retrieveObjects(clientContext, this).then(resolve, reject);
            });
        });
    }
};
