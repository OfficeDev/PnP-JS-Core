"use strict";

import { expect } from "chai";
import { Lists, List } from "../../../../src/core/sharepoint/rest/lists";

describe("Lists", () => {

    let lists: Lists;

    beforeEach(() => {
        lists = new Lists("_api/web");
    });

    it("Should be an object", () => {
        expect(lists).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/lists", () => {
            expect(lists.toUrl()).to.equal("_api/web/lists");
        });
    });
    describe("getByTitle", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')", () => {
            let list = lists.getByTitle("Tasks");
            expect(list.toUrl()).to.equal("_api/web/lists/getByTitle('Tasks')");
        });
    });
    describe("getById", () => {
        it("Should return _api/web/lists('4FC65058-FDDE-4FAD-AB21-2E881E1CF527')", () => {
            let list = lists.getById("4FC65058-FDDE-4FAD-AB21-2E881E1CF527");
            expect(list.toUrl()).to.equal("_api/web/lists(guid'4FC65058-FDDE-4FAD-AB21-2E881E1CF527')");
        });
    });
});

describe("List", () => {

    let list: List;

    beforeEach(() => {
        list = new List("_api/web/lists", "getByTitle('Tasks')");
    });

    it("Should be an object", () => {
        expect(list).to.be.a("object");
    });

    describe("contentTypes", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/contenttypes", () => {
            expect(list.contentTypes.toUrl()).to.eq("_api/web/lists/getByTitle('Tasks')/contenttypes");
        });
    });

    describe("items", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/items", () => {
            expect(list.items.toUrl()).to.eq("_api/web/lists/getByTitle('Tasks')/items");
        });
    });

    describe("views", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/views", () => {
            expect(list.views.toUrl()).to.eq("_api/web/lists/getByTitle('Tasks')/views");
        });
    });

    describe("fields", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/fields", () => {
            expect(list.fields.toUrl()).to.eq("_api/web/lists/getByTitle('Tasks')/fields");
        });
    });

    describe("defaultView", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/DefaultView", () => {
            expect(list.defaultView.toUrl()).to.eq("_api/web/lists/getByTitle('Tasks')/DefaultView");
        });
    });

    describe("effectiveBasePermissions", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/EffectiveBasePermissions", () => {
            expect(list.effectiveBasePermissions.toUrl()).to.eq("_api/web/lists/getByTitle('Tasks')/EffectiveBasePermissions");
        });
    });

    describe("eventReceivers", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/EventReceivers", () => {
            expect(list.eventReceivers.toUrl()).to.eq("_api/web/lists/getByTitle('Tasks')/EventReceivers");
        });
    });

    describe("relatedFields", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/getRelatedFields", () => {
            expect(list.relatedFields.toUrl()).to.eq("_api/web/lists/getByTitle('Tasks')/getRelatedFields");
        });
    });

    describe("informationRightsManagementSettings", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/InformationRightsManagementSettings", () => {
            expect(list.informationRightsManagementSettings.toUrl())
                .to.eq("_api/web/lists/getByTitle('Tasks')/InformationRightsManagementSettings");
        });
    });

    describe("userCustomActions", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/UserCustomActions", () => {
            expect(list.userCustomActions.toUrl())
                .to.eq("_api/web/lists/getByTitle('Tasks')/UserCustomActions");
        });
    });

    describe("getView", () => {
        it("should return _api/web/lists/getByTitle('Tasks')/getView('b81b1b32-ed0a-4b80-bd16-67c99a4f3c1c')", () => {
            expect(list.getView("b81b1b32-ed0a-4b80-bd16-67c99a4f3c1c").toUrl())
                .to.eq("_api/web/lists/getByTitle('Tasks')/getView('b81b1b32-ed0a-4b80-bd16-67c99a4f3c1c')");
        });
    });
});
