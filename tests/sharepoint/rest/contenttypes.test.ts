"use strict";

import { expect } from "chai";
import { ContentTypes, ContentType } from "../../../src/sharepoint/rest/ContentTypes";

describe("ContentTypes", () => {
    it("Should be an object", () => {
        let contenttypes = new ContentTypes("_api/web/lists/getByTitle('Tasks')");
        expect(contenttypes).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')/contenttypes", () => {
            let contenttypes = new ContentTypes("_api/web/lists/getByTitle('Tasks')");
            expect(contenttypes.toUrl()).to.equal("_api/web/lists/getByTitle('Tasks')/contenttypes");
        });
    });
    describe("getById", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')", () => {
            let contenttypes = new ContentTypes("_api/web/lists/getByTitle('Tasks')");
            let ct = contenttypes.getById("0x0101000BB1B729DCB7414A9344ED650D3C05B3");
            expect(ct.toUrl()).to.equal("_api/web/lists/getByTitle('Tasks')/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')");
        });
    });
    describe("ContentType", () => {
        let contentType: ContentType;

        beforeEach(() => {
            contentType = new ContentType("_api/web", "contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')");
        });

        it("Should be an object", () => {
            expect(contentType).to.be.a("object");
        });

        describe("descriptionResource", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/descriptionResource", () => {
                expect(contentType.descriptionResource.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/descriptionResource"
                    );
            });
        });

        describe("fieldLinks", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/fieldLinks", () => {
                expect(contentType.fieldLinks.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/fieldLinks"
                    );
            });
        });

        describe("fields", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/fields", () => {
                expect(contentType.fields.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/fields"
                    );
            });
        });

        describe("nameResource", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/nameResource", () => {
                expect(contentType.nameResource.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/nameResource"
                    );
            });
        });

        describe("parent", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/parent", () => {
                expect(contentType.parent.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/parent"
                    );
            });
        });

        describe("description", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/description", () => {
                expect(contentType.description.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/description"
                    );
            });
        });

        describe("workflowAssociations", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/workflowAssociations", () => {
                expect(contentType.workflowAssociations.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/workflowAssociations"
                    );
            });
        });

        describe("displayFormTemplateName", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/displayFormTemplateName", () => {
                expect(contentType.displayFormTemplateName.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/displayFormTemplateName"
                    );
            });
        });

        describe("displayFormUrl", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/displayFormUrl", () => {
                expect(contentType.displayFormUrl.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/displayFormUrl"
                    );
            });
        });

        describe("documentTemplate", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/documentTemplate", () => {
                expect(contentType.documentTemplate.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/documentTemplate"
                    );
            });
        });

        describe("documentTemplateUrl", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/documentTemplateUrl", () => {
                expect(contentType.documentTemplateUrl.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/documentTemplateUrl"
                    );
            });
        });

        describe("editFormTemplateName", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/editFormTemplateName", () => {
                expect(contentType.editFormTemplateName.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/editFormTemplateName"
                    );
            });
        });

        describe("editFormUrl", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/editFormUrl", () => {
                expect(contentType.editFormUrl.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/editFormUrl"
                    );
            });
        });

        describe("group", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/group", () => {
                expect(contentType.group.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/group"
                    );
            });
        });

        describe("hidden", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/hidden", () => {
                expect(contentType.hidden.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/hidden"
                    );
            });
        });

        describe("jsLink", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/jsLink", () => {
                expect(contentType.jsLink.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/jsLink"
                    );
            });
        });

        describe("name", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/name", () => {
                expect(contentType.name.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/name"
                    );
            });
        });

        describe("newFormTemplateName", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/newFormTemplateName", () => {
                expect(contentType.newFormTemplateName.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/newFormTemplateName"
                    );
            });
        });

        describe("newFormUrl", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/newFormUrl", () => {
                expect(contentType.newFormUrl.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/newFormUrl"
                    );
            });
        });

        describe("readOnly", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/readOnly", () => {
                expect(contentType.readOnly.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/readOnly"
                    );
            });
        });

        describe("schemaXml", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/schemaXml", () => {
                expect(contentType.schemaXml.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/schemaXml"
                    );
            });
        });

        describe("scope", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/scope", () => {
                expect(contentType.scope.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/scope"
                    );
            });
        });

        describe("sealed", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/sealed", () => {
                expect(contentType.sealed.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/sealed"
                    );
            });
        });

        describe("stringId", () => {
            it("Should return _api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/stringId", () => {
                expect(contentType.stringId.toUrl()).to.equal(
                    "_api/web/contenttypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')/stringId"
                    );
            });
        });
    });
});
