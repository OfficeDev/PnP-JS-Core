/// <reference path="../../../../../typings/main.d.ts" />
"use strict";

import { ObjectPropertyBagEntries } from "./objectpropertybagentries";
import * as Util from "../../../../utils/util";
import { expect } from "chai";

describe("ObjectPropertybagEntries", () => {
    describe("ProvisionObjects", () => {
        it("Should create contextual callback", (done) => {
            let func = function(a) {
                let promise = new ObjectPropertyBagEntries().ProvisionObjects(undefined);
                expect(promise).to.be.instanceof(Promise);
                done();
            };
            let ctx = { num: 1 };
            let callback = Util.getCtxCallback(ctx, func, 7);
            expect(callback).to.exist;
            expect(callback).to.be.a("function");
            // this call will update ctx var inside the callback
            callback();
        });
    });
});
