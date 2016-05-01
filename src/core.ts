"use strict";

import { Util } from "./core/utils/Util";
import { SharePoint } from "./core/SharePoint/SharePoint";
import { PnPClientStorage } from "./core/utils/Storage";
import * as Configuration from "./core/configuration/configuration";
import { Logger } from "./core/utils/logging";
import { Rest } from "./core/SharePoint/Rest/rest";

/**
 * Root class of the Patterns and Practices namespace, provides an entry point to the library
 */
export class Core {
    /**
     * Utility methods
     */
    public util = Util;

    /**
     * The full SharePoint library
     */
    public sharepoint = new SharePoint();

    /**
     * Provides easy access to the REST interface
     */
    public sp = new Rest();

    /**
     * Provides access to local and session storage
     */
    public storage: PnPClientStorage = new PnPClientStorage();

    /**
     * Global configuration instance to which providers can be added
     */
    public configuration = Configuration;

    /**
     * Global logging instance to which subscribers can be registered and messages written
     */
    public log = Logger;
}
