"use strict";

import { expect } from "chai";
import { ContentTypes } from "../ContentTypes";

describe("ContentTypes", () => {
    it("Should be an object", () => {
        let contenttypes = new ContentTypes("_api/web/lists/getByTitle('Tasks')");
        expect(contenttypes).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')/ContentTypes", () => {
            let contenttypes = new ContentTypes("_api/web/lists/getByTitle('Tasks')");
            expect(contenttypes.toUrl()).to.equal("_api/web/lists/getByTitle('Tasks')/contentTypes");
        });
    });
    describe("getById", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')/ContentTypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')", () => {
            let contenttypes = new ContentTypes("_api/web/lists/getByTitle('Tasks')");
            let ct = contenttypes.getById("0x0101000BB1B729DCB7414A9344ED650D3C05B3");
            expect(ct.toUrl()).to.equal("_api/web/lists/getByTitle('Tasks')/contentTypes('0x0101000BB1B729DCB7414A9344ED650D3C05B3')");
        });
    });
});
