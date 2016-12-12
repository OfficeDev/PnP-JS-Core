"use strict";

import { QueryableTaxonomy } from "./QueryableTaxonomy";
import { TaxonomyParser } from "./TaxonomyParser";

/**
 * Root of the SharePoint TaxonomySession module
 */
export class TaxonomySession {
    /**
     * Retrieves the default site collection term store
     */
    public getDefaultSiteCollectionTermStore(clientContext: SP.ClientContext): Promise<SP.Taxonomy.TermStore> {
        return new Promise<SP.Taxonomy.TermStore>((resolve, reject) => {
            this.getTaxonomySession(clientContext).then((taxSession: SP.Taxonomy.TaxonomySession) => {
                let termStore = taxSession.getDefaultSiteCollectionTermStore();
                resolve(termStore);
            });
        });
    }

     /**
     * Retrieves the default site collection term store
     */
    public getTaxonomySession(clientContext: SP.ClientContext): Promise<SP.Taxonomy.TaxonomySession> {
        return new Promise<SP.Taxonomy.TaxonomySession>((resolve, reject) => {
            this.EnsureSPTaxonomy().then(() => {
                let taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(clientContext);
                resolve(taxSession);
            });
        });
    }

    public retrieveObjects(clientContext: SP.ClientContext, qt: QueryableTaxonomy): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let objects = qt.clientObjects;
            clientContext.load(objects);
            clientContext.executeQueryAsync(() => {
                resolve(new TaxonomyParser(objects, qt.type).result());
            }, reject);
        });
    }

    /**
     * Loads the scripts sp.taxonomy.js and sp.js from /_layouts/15
     */
    private EnsureSPTaxonomy(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (SP.hasOwnProperty("Taxonomy")) {
                resolve();
            } else {
                SP.SOD.registerSod("sp.taxonomy.js", `${_spPageContextInfo.siteAbsoluteUrl}/_layouts/15/sp.taxonomy.js`);
                SP.SOD.registerSodDep("sp.taxonomy.js", "sp.js");
                SP.SOD.executeFunc("sp.taxonomy.js", "TaxonomySession", resolve);
            }
        });
    }
};
