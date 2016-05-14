"use strict";

import { expect } from "chai";
import { QueryableInstance, QueryableCollection } from "../../../src/sharepoint/rest/Queryable";

describe("QueryableInstance", () => {

    let queryable: QueryableInstance;

    beforeEach(() => {
        queryable = new QueryableInstance("_api/web");
    });

    describe("select", () => {
        it("Should append a select query", () => {
            queryable.select("Title", "Description");
            expect(queryable.toUrlAndQuery()).to.include("$select=Title,Description");
        });
    });

    describe("expand", () => {
        it("Should append an expand query", () => {
            queryable.expand("User\\Email", "Another\\Field");
            expect(queryable.toUrlAndQuery()).to.include("$expand=User\\Email,Another\\Field");
        });
    });
});

describe("QueryableCollection", () => {

    let queryable: QueryableCollection;

    beforeEach(() => {
        queryable = new QueryableCollection("_api/web");
    });

    describe("expand", () => {
        it("Should append an expand query", () => {
            queryable.expand("User\\Email", "Another\\Field");
            expect(queryable.toUrlAndQuery()).to.include("$expand=User\\Email,Another\\Field");
        });
    });

    describe("filter", () => {
        it("Should append a filter query", () => {
            queryable.filter("Title eq 'Tasks'");
            expect(queryable.toUrlAndQuery()).to.include("$filter=Title eq 'Tasks'");
        });
    });

    describe("orderBy", () => {
        it("Should append a single order by query ascending", () => {
            queryable.orderBy("Title", true);
            expect(queryable.toUrlAndQuery()).to.include("$orderby=Title asc");
        });
    });

    describe("orderBy", () => {
        it("Should append multiple order by queries", () => {
            queryable.orderBy("Title", true);
            queryable.orderBy("Description");
            expect(queryable.toUrlAndQuery()).to.include("$orderby=Title asc,Description");
        });
    });

    describe("select", () => {
        it("Should append a select query", () => {
            queryable.select("Title", "Description");
            expect(queryable.toUrlAndQuery()).to.include("$select=Title,Description");
        });
    });

    describe("skip", () => {
        it("Should append a skip query", () => {
            queryable.skip(10);
            expect(queryable.toUrlAndQuery()).to.include("$skip=10");
        });
    });

    describe("top", () => {
        it("Should append a top query", () => {
            queryable.top(5);
            expect(queryable.toUrlAndQuery()).to.include("$top=5");
        });
    });
});

