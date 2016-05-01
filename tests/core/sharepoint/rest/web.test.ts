"use strict";

import { expect } from "chai";
import { Web } from "../../../../src/core/sharepoint/rest/webs";

describe("Web", () => {

    let web: Web;

    beforeEach(() => {
        web = new Web("_api", "web");
    });

    it("Should be an object", () => {
        expect(web).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web", () => {
            expect(web.toUrl()).to.equal("_api/web");
        });
    });

    describe("webs", () => {
        it("should return _api/web/webs", () => {
            expect(web.webs.toUrl()).to.eq("_api/web/webs");
        });
    });

    describe("contentTypes", () => {
        it("should return _api/web/contenttypes", () => {
            expect(web.contentTypes.toUrl()).to.eq("_api/web/contenttypes");
        });
    });

    describe("lists", () => {
        it("should return _api/web/lists", () => {
            expect(web.lists.toUrl()).to.eq("_api/web/lists");
        });
    });

    describe("navigation", () => {
        it("should return _api/web/navigation", () => {
            expect(web.navigation.toUrl()).to.eq("_api/web/navigation");
        });
    });

    describe("siteUsers", () => {
        it("should return _api/web/siteUsers", () => {
            expect(web.siteUsers.toUrl()).to.eq("_api/web/siteusers");
        });
    });

    describe("folders", () => {
        it("should return _api/web/folders", () => {
            expect(web.folders.toUrl()).to.eq("_api/web/folders");
        });
    });

    describe("getFolderByServerRelativeUrl", () => {
        it("should return _api/web/getFolderByServerRelativeUrl('/sites/dev/shared documents/folder')", () => {
            expect(web.getFolderByServerRelativeUrl("/sites/dev/shared documents/folder").toUrl())
                .to.eq("_api/web/getFolderByServerRelativeUrl('/sites/dev/shared documents/folder')");
        });
    });

    describe("getFileByServerRelativeUrl", () => {
        it("should return _api/web/getFileByServerRelativeUrl('/sites/dev/shared documents/folder/doc.docx')", () => {
            expect(web.getFileByServerRelativeUrl("/sites/dev/shared documents/folder/doc.docx").toUrl())
                .to.eq("_api/web/getFileByServerRelativeUrl('/sites/dev/shared documents/folder/doc.docx')");
        });
    });

    describe("availableWebTemplates", () => {
        it("should return _api/web/getavailablewebtemplates(lcid=1033, doincludecrosslanguage=true)", () => {
            expect(web.availableWebTemplates(1033, true).toUrl())
                .to.eq("_api/web/getavailablewebtemplates(lcid=1033, doincludecrosslanguage=true)");
        });
    });

    describe("customListTemplate", () => {
        it("should return _api/web/getcustomlisttemplates", () => {
            expect(web.customListTemplate.toUrl()).to.eq("_api/web/getcustomlisttemplates");
        });
    });

    describe("getUserById", () => {
        it("should return _api/web/getUserById(4)", () => {
            expect(web.getUserById(4).toUrl()).to.eq("_api/web/getUserById(4)");
        });
    });
});
