"use strict";

import { QueryableTaxonomy } from "./QueryableTaxonomy";
import { TermSets } from "./TermSets";
import { Util } from "../../utils/util";

/**
 * Describes a collection of TermGroup objects
 *
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
                this.taxSession.retrieveObjects(this.clientContext, this).then(objects => {
                    resolve(objects);
                }, reject);
            });
        });
    }
};

/**
 * Describes a single TermGroup instance
 *
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
            this.taxSession.getDefaultSiteCollectionTermStore(this.clientContext).then(defaultTermStore => {
                let groups = defaultTermStore.get_groups();
                this.clientObjects = Util.isValidGUID(this.identifier) ?
                    groups.getById(new SP.Guid(this.identifier)) :
                    groups.getByName(this.identifier);
                this.taxSession.retrieveObjects(this.clientContext, this).then(objects => {
                    resolve(objects);
                }, reject);
            });
        });
    }
};
