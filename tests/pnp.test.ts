"use strict";

import { expect } from "chai";
import { Core } from "../src/core";

describe("new Core()", () => {

    it("util should not be null", () => {
        expect(new Core().util).to.not.be.null;
    });

    it("sharepoint should not be null", () => {
        expect(new Core().sharepoint).to.not.be.null;
    });

    it("storage should not be null", () => {
        expect(new Core().storage).to.not.be.null;
    });

    it("configuration should not be null", () => {
        expect(new Core().configuration).to.not.be.null;
    });

    it("logging should not be null", () => {
        expect(new Core().log).to.not.be.null;
    });
});
