"use strict";

import { expect } from "chai";
import { RoleAssignments } from "../../../../src/core/sharepoint/rest/roleAssignments";

describe("RoleAssignments", () => {
    it("Should be an object", () => {
        let roleAssignments = new RoleAssignments("_api/web");
        expect(roleAssignments).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/RoleAssignments", () => {
            let roleAssignments = new RoleAssignments("_api/web");
            expect(roleAssignments.toUrl()).to.equal("_api/web/RoleAssignments");
        });
    });
});
