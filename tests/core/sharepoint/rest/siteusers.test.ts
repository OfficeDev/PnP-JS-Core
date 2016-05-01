"use strict";

import { expect } from "chai";
import { SiteUsers } from "../../../../src/core/sharepoint/rest/siteUsers";

describe("SiteUsers", () => {
    it("Should be an object", () => {
        let siteUsers = new SiteUsers("_api/web");
        expect(siteUsers).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/siteusers", () => {
            let siteUsers = new SiteUsers("_api/web");
            expect(siteUsers.toUrl()).to.equal("_api/web/siteusers");
        });
    });
});
