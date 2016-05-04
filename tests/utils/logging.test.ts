"use strict";

import { expect } from "chai";
import * as Logging from "../../src/utils/logging";

describe("Logging", () => {

    describe("Logger", () => {

        let logger = Logging.Logger;

        beforeEach(() => {
            logger.clearSubscribers();
        });

        it("Can create an Logger instance and subscribe an ILogListener", () => {
            let message = "Test message";
            let message2 = "";
            logger.subscribe(new logger.FunctionListener((e) => {
                message2 = e.message;
            }));
            logger.write(message, logger.LogLevel.Warning);
            expect(message2).to.eq(message);
        });

        it("Can create an Logger instance and log a simple object", () => {
            let message2 = "";
            let level2 = logger.LogLevel.Verbose;
            logger.subscribe(new logger.FunctionListener((e) => {
                level2 = e.level;
                message2 = e.message;
            }));
            logger.log({ level: logger.LogLevel.Error, message: "Test message" });
            expect(message2).to.eq("Test message");
            expect(level2).to.eql(logger.LogLevel.Error);
        });

        it("Should return an accurate count of subscribers", () => {
            logger.subscribe(new logger.FunctionListener((e) => { return; }));
            logger.subscribe(new logger.FunctionListener((e) => { return; }));
            logger.subscribe(new logger.FunctionListener((e) => { return; }));
            expect(logger.count).to.eq(3);
        });

        it("Should allow multiple subscribes to be added in one call", () => {
            logger.subscribe(
                new logger.FunctionListener((e) => { return; }),
                new logger.FunctionListener((e) => { return; }),
                new logger.FunctionListener((e) => { return; })
            );
            expect(logger.count).to.eq(3);
        });

        it("Should correctly log to multiple listeners", () => {
            let message1 = "";
            let message2 = "";
            let message3 = "";
            logger.subscribe(
                new logger.FunctionListener((e) => { message1 = e.message; }),
                new logger.FunctionListener((e) => { message2 = e.message; }),
                new logger.FunctionListener((e) => { message3 = e.message; })
            );
            logger.activeLogLevel = logger.LogLevel.Verbose;
            logger.write("Test message");
            expect(message1).to.eq("Test message");
            expect(message2).to.eq("Test message");
            expect(message3).to.eq("Test message");
        });
    });
});
