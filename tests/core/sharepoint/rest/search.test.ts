"use strict";

import { expect } from "chai";
import { Search } from "../../../../src/core/sharepoint/rest/search";

describe("Search", () => {
    it("Should be an object", () => {
        let searchquery = new Search("_api", {Querytext: "Test", RowLimit: 100, TrimDuplicates: false});
        expect(searchquery).to.be.a("object");
    });
});
