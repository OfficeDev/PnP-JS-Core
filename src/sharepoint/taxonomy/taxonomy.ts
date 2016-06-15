"use strict";

import { TermGroups } from "./TermGroups";

/**
 * Root of the SharePoint Taxonomy module
 */
export class Taxonomy {
    public get termgroups(): TermGroups {
        return new TermGroups();
    }
};
