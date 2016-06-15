"use strict";

import { QueryableTaxonomy } from "./QueryableTaxonomy";
import { Terms } from "./Terms";
import { Util } from "../../utils/util";

/**
 * Root of the SharePoint Taxonomy module
 */
export class TermSet extends QueryableTaxonomy {
    private groupIdentifier: string;
    private identifier: string;

    /**
     * Creates a new instance of the TermSet class
     */
    constructor(groupIdentifier: string, identifier: string) {
        super("SP.Taxonomy.TermSet");
        this.groupIdentifier = groupIdentifier;
        this.identifier = identifier;
    }

    public terms(): Terms {
        return new Terms(this.groupIdentifier, this.identifier, "get_terms");
    }

    public allterms(): Terms {
        return new Terms(this.groupIdentifier, this.identifier, "getAllTerms");
    }

    public get(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.taxSession.getDefaultSiteCollectionTermStore(this.clientContext).then(defaultTermStore => {
                let groups = defaultTermStore.get_groups();
                let group = Util.isValidGUID(this.groupIdentifier) ?
                    groups.getById(new SP.Guid(this.groupIdentifier)) :
                    groups.getByName(this.groupIdentifier);
                let termSets = group.get_termSets();
                this.clientObjects = Util.isValidGUID(this.identifier) ?
                    termSets.getById(new SP.Guid(this.identifier)) :
                    termSets.getByName(this.identifier);
                this.taxSession.retrieveObjects(this.clientContext, this).then(resolve, reject);
            });
        });
    }
};
