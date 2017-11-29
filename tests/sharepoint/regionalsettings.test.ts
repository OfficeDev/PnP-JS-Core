import { expect } from "chai";
import { RegionalSettings } from "../../src/sharepoint/regionalsettings";
import { toMatchEndRegex } from "../testutils";

describe("RegionalSettings", () => {

    let regionalsettings: RegionalSettings;

    beforeEach(() => {
        regionalsettings = new RegionalSettings("_api/web");
    });

    it("Should be an object", () => {
        expect(regionalsettings).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/regionalsettings", () => {
            expect(regionalsettings.toUrl()).to.match(toMatchEndRegex("_api/web/regionalsettings"));
        });
    });

    describe("installedLanguages", () => {
        it("Should return _api/web/regionalsettings/installedlanguages", () => {
            expect(regionalsettings.installedLanguages.toUrl()).to.match(toMatchEndRegex("_api/web/regionalsettings/installedlanguages"));
        });
    });

    describe("timeZone", () => {
        it("Should return _api/web/regionalsettings/timezone", () => {
            expect(regionalsettings.timeZone.toUrl()).to.match(toMatchEndRegex("_api/web/regionalsettings/timezone"));
        });
    });

    describe("timeZones", () => {
        it("Should return _api/web/regionalsettings/timezones", () => {
            expect(regionalsettings.timeZones.toUrl()).to.match(toMatchEndRegex("_api/web/regionalsettings/timezones"));
        });
    });
});
