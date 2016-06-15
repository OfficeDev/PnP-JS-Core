"use strict";

/**
 * Root of the SharePoint TaxonomySession module
 */
export class TaxonomySession {
    /**
     * Retrieves the default site collection term store
     */
    public getDefaultSiteCollectionTermStore(clientContext: SP.ClientContext): Promise<SP.Taxonomy.TermStore> {
        return new Promise<any>((resolve, reject) => {
            this.LoadDepScripts().then(() => {
                let taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(clientContext);
                let termStore = taxSession.getDefaultSiteCollectionTermStore();
                resolve(termStore);
            });
        });
    }

    public retrieveObjects(clientContext: SP.ClientContext, objects: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            clientContext.load(objects);
            clientContext.executeQueryAsync(() => {
                resolve(objects.get_data());
            }, reject);
        });
    }

    /**
     * Loads the scripts sp.taxonomy.js and sp.js from /_layouts/15
     */
    private LoadDepScripts(): Promise<any> {
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
