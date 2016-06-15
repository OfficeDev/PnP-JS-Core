"use strict";

import { TaxonomySession } from "./TaxonomySession";
import { Util } from "../../utils/util";

/**
 * Root of the SharePoint TermGroups module
 */
export class TermGroup {
    private taxSession: TaxonomySession = new TaxonomySession();
    private identifier: string;

    constructor(identifier: string) {
        this.identifier = identifier;
    }

    public get(): Promise<any> {
        return new Promise((resolve, reject) => {
            const clientContext = SP.ClientContext.get_current();
            this.taxSession.getDefaultSiteCollectionTermStore(clientContext).then(defaultTermStore => {
                let objects = Util.isValidGUID(this.identifier) ?
                    defaultTermStore.get_groups().getById(new SP.Guid(this.identifier)) :
                    defaultTermStore.get_groups().getByName(this.identifier);
                this.taxSession.retrieveObjects(clientContext, objects).then(resolve, reject);
            });
        });
    }
};
