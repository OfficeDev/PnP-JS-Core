"use strict";
declare var global: any;
import * as chai from "chai";
import pnp from "../src/pnp";
import { Util } from "../src/utils/util";
import { Web } from "../src/sharepoint/rest/webs";
import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

export let testSettings = Util.extend(global.settings.testing, { webUrl: "" });

before(function (done: MochaDone) {

    // this may take some time, don't timeout early
    this.timeout(90000);

    // establish the connection to sharepoint
    if (testSettings.enableWebTests) {

        pnp.setup({
            headers: {
                "Accept": "application/json;odata=verbose",
            },
            nodeClientOptions: {
                credentials: testSettings.credentials,
                siteUrl: testSettings.siteUrl,
            },
        });

        // comment this out to keep older subsites
        // cleanUpAllSubsites();

        // create the web in which we will test
        let d = new Date();
        let g = Util.getGUID();

        pnp.sp.web.webs.add(`PnP-JS-Core Testing ${d.toDateString()}`, g).then(() => {

            let url = Util.combinePaths(testSettings.siteUrl, g);

            // set the testing web url so our tests have access if needed
            testSettings.webUrl = url;

            // re-setup the node client to use the new web
            pnp.setup({
                    headers: {
                    "Accept": "application/json;odata=verbose",
                },
                nodeClientOptions: {
                    credentials: testSettings.credentials,
                    siteUrl: testSettings.siteUrl,
                },
            });

            done();
        })
            .catch(done);
    } else {
        done();
    }
});

after(() => {

    // could remove the sub web here?
    // clean up other stuff?
    // write some logging?
});

// this can be used to clean up lots of test sub webs :)
export function cleanUpAllSubsites() {
    pnp.sp.site.rootWeb.webs.select("Title").get().then((w) => {
        w.forEach(element => {
            let web = new Web(element["odata.id"], "");
            web.webs.select("Title").get().then((sw: any[]) => {
                return Promise.all(sw.map((value, index, arr) => {
                    let web2 = new Web(value["odata.id"], "");
                    return web2.delete();
                }));
            }).then(() => { web.delete(); });
        });
    }).catch(e => console.log("Error: " + JSON.stringify(e)));
}
