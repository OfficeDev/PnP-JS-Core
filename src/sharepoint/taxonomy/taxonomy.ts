"use strict";

import { TermGroups } from "./TermGroups";

/**
 * Root of the SharePoint Taxonomy module
 */
export class Taxonomy {

    /**
     * Returns a new instance of TermGroup
     */
    public get termgroups(): TermGroups {
        return new TermGroups();
    }
};
