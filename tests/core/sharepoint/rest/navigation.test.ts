"use strict";

import { expect } from "chai";
import { Navigation } from "../../../../src/core/sharepoint/rest/navigation";

describe("Navigation", () => {
    it("Should be an object", () => {
        let navigation = new Navigation("_api/web");
        expect(navigation).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/Navigation", () => {
            let navigation = new Navigation("_api/web");
            expect(navigation.toUrl()).to.equal("_api/web/navigation");
        });
    });
});
