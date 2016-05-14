"use strict";

import { Util } from "../../../src/utils/util";
import { expect } from "chai";
import { Fields, Field } from "../../../src/sharepoint/rest/fields";

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
        let path: string = Util.combinePaths(basePath, "fields");
        it("Should return " + path, () => {
            expect(fields.toUrl()).to.equal(path);
        });
    });

    describe("getByTitle", () => {
        let path: string = Util.combinePaths(basePath, "fields/getByTitle('Title')");
        it("Should return " + path, () => {
            expect(fields.getByTitle("Title").toUrl()).to.equal(path);
        });
    });

    describe("getById", () => {
        let path: string = Util.combinePaths(basePath, "fields('cc1322c5-376d-4b8a-87cb-1e21330c6df2')");
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

    describe("descriptionResource", () => {
        let path: string = Util.combinePaths(basePath, "canBeDeleted");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/canBeDeleted", () => {
            expect(field.canBeDeleted.toUrl()).to.equal(path);
        });
    });
    describe("defaultValue", () => {
        let path: string = Util.combinePaths(basePath, "defaultValue");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/defaultValue", () => {
            expect(field.defaultValue.toUrl()).to.equal(path);
        });
    });
    describe("description", () => {
        let path: string = Util.combinePaths(basePath, "description");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/description", () => {
            expect(field.description.toUrl()).to.equal(path);
        });
    });
    describe("direction", () => {
        let path: string = Util.combinePaths(basePath, "direction");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/direction", () => {
            expect(field.direction.toUrl()).to.equal(path);
        });
    });
    describe("enforceUniqueValues", () => {
        let path: string = Util.combinePaths(basePath, "enforceUniqueValues");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/enforceUniqueValues", () => {
            expect(field.enforceUniqueValues.toUrl()).to.equal(path);
        });
    });
    describe("entityPropertyName", () => {
        let path: string = Util.combinePaths(basePath, "entityPropertyName");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/entityPropertyName", () => {
            expect(field.entityPropertyName.toUrl()).to.equal(path);
        });
    });
    describe("filterable", () => {
        let path: string = Util.combinePaths(basePath, "filterable");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/filterable", () => {
            expect(field.filterable.toUrl()).to.equal(path);
        });
    });
    describe("fromBaseType", () => {
        let path: string = Util.combinePaths(basePath, "fromBaseType");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/fromBaseType", () => {
            expect(field.fromBaseType.toUrl()).to.equal(path);
        });
    });
    describe("group", () => {
        let path: string = Util.combinePaths(basePath, "group");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/group", () => {
            expect(field.group.toUrl()).to.equal(path);
        });
    });
    describe("hidden", () => {
        let path: string = Util.combinePaths(basePath, "hidden");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/hidden", () => {
            expect(field.hidden.toUrl()).to.equal(path);
        });
    });
    describe("id", () => {
        let path: string = Util.combinePaths(basePath, "id");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/id", () => {
            expect(field.id.toUrl()).to.equal(path);
        });
    });
    describe("indexed", () => {
        let path: string = Util.combinePaths(basePath, "indexed");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/indexed", () => {
            expect(field.indexed.toUrl()).to.equal(path);
        });
    });
    describe("internalName", () => {
        let path: string = Util.combinePaths(basePath, "internalName");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/internalName", () => {
            expect(field.internalName.toUrl()).to.equal(path);
        });
    });
    describe("jsLink", () => {
        let path: string = Util.combinePaths(basePath, "jsLink");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/jsLink", () => {
            expect(field.jsLink.toUrl()).to.equal(path);
        });
    });
    describe("readOnlyField", () => {
        let path: string = Util.combinePaths(basePath, "readOnlyField");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/readOnlyField", () => {
            expect(field.readOnlyField.toUrl()).to.equal(path);
        });
    });
    describe("required", () => {
        let path: string = Util.combinePaths(basePath, "required");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/required", () => {
            expect(field.required.toUrl()).to.equal(path);
        });
    });
    describe("schemaXml", () => {
        let path: string = Util.combinePaths(basePath, "schemaXml");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/schemaXml", () => {
            expect(field.schemaXml.toUrl()).to.equal(path);
        });
    });
    describe("scope", () => {
        let path: string = Util.combinePaths(basePath, "scope");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/scope", () => {
            expect(field.scope.toUrl()).to.equal(path);
        });
    });
    describe("sealed", () => {
        let path: string = Util.combinePaths(basePath, "sealed");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/sealed", () => {
            expect(field.sealed.toUrl()).to.equal(path);
        });
    });
    describe("sortable", () => {
        let path: string = Util.combinePaths(basePath, "sortable");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/sortable", () => {
            expect(field.sortable.toUrl()).to.equal(path);
        });
    });
    describe("staticName", () => {
        let path: string = Util.combinePaths(basePath, "staticName");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/staticName", () => {
            expect(field.staticName.toUrl()).to.equal(path);
        });
    });
    describe("title", () => {
        let path: string = Util.combinePaths(basePath, "title");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/title", () => {
            expect(field.title.toUrl()).to.equal(path);
        });
    });
    describe("fieldTypeKind", () => {
        let path: string = Util.combinePaths(basePath, "fieldTypeKind");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/fieldTypeKind", () => {
            expect(field.fieldTypeKind.toUrl()).to.equal(path);
        });
    });
    describe("typeAsString", () => {
        let path: string = Util.combinePaths(basePath, "typeAsString");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/typeAsString", () => {
            expect(field.typeAsString.toUrl()).to.equal(path);
        });
    });
    describe("typeDisplayName", () => {
        let path: string = Util.combinePaths(basePath, "typeDisplayName");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/typeDisplayName", () => {
            expect(field.typeDisplayName.toUrl()).to.equal(path);
        });
    });
    describe("typeShortDescription", () => {
        let path: string = Util.combinePaths(basePath, "typeShortDescription");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/typeShortDescription", () => {
            expect(field.typeShortDescription.toUrl()).to.equal(path);
        });
    });
    describe("validationFormula", () => {
        let path: string = Util.combinePaths(basePath, "validationFormula");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/validationFormula", () => {
            expect(field.validationFormula.toUrl()).to.equal(path);
        });
    });
    describe("validationMessage", () => {
        let path: string = Util.combinePaths(basePath, "validationMessage");
        it("Should return _api/web/lists/getByTitle('Tasks')/fields/getByTitle('Title')/validationMessage", () => {
            expect(field.validationMessage.toUrl()).to.equal(path);
        });
    });
});
