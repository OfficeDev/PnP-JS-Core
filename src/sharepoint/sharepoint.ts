"use strict";

import { Provisioning } from "./Provisioning/Provisioning";
import { Util } from "./Util";

export class SharePoint {

    /**
    * The Provisioning base class for SharePoint
    */
    public provisioning: Provisioning = new Provisioning();

    /**
     * Provides sharepoint utility method access
     */
    public util = Util;
}
