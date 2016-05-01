"use strict";

import { Util } from "../../../../src/core/utils/util";
import { expect } from "chai";
import { Fields, Field } from "../../../../src/core/sharepoint/rest/fields";

describe("Fields", () => {

    let basePath = "_api/web/lists/getByTitle('Tasks')";
    let fields: Fields;

    beforeEach(() => {
        fields = new Fields(basePath);
    });

    it("Should be an object", () => {
        expect(fields).to.be.a("object");
    });

    describe("url", () => {
        let path = Util.combinePaths(basePath, "fields");
        it("Should return " + path, () => {
            expect(fields.toUrl()).to.equal(path);
        });
    });

    describe("getByTitle", () => {
        let path = Util.combinePaths(basePath, "fields/getByTitle('Title')");
        it("Should return " + path, () => {
            expect(fields.getByTitle("Title").toUrl()).to.equal(path);
        });
    });

    describe("getById", () => {
        let path = Util.combinePaths(basePath, "fields('cc1322c5-376d-4b8a-87cb-1e21330c6df2')");
        it("Should return " + path, () => {
            expect(fields.getById("cc1322c5-376d-4b8a-87cb-1e21330c6df2").toUrl()).to.equal(path);
        });
    });
});

describe("Field", () => {

    let basePath = "_api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')";
    let field: Field;

    beforeEach(() => {
        field = new Field(basePath);
    });

    it("Should be an object", () => {
        expect(field).to.be.a("object");
    });
});
