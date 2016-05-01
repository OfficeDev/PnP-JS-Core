"use strict";

import { expect } from "chai";
import { TopNavigationBar } from "../../../../src/core/sharepoint/rest/topNavigationBar";

describe("TopNavigationBar", () => {
    it("Should be an object", () => {
        let topNavigationBar = new TopNavigationBar("_api/web/Navigation");
        expect(topNavigationBar).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/Navigation/TopNavigationBar", () => {
            let topNavigationBar = new TopNavigationBar("_api/web/Navigation");
            expect(topNavigationBar.toUrl()).to.equal("_api/web/Navigation/TopNavigationBar");
        });
    });
});
