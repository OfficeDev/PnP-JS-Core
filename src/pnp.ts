"use strict";

import { Util } from "./utils/Util";
import { SharePoint } from "./SharePoint/SharePoint";
import { PnPClientStorage } from "./utils/Storage";
import * as Configuration from "./configuration/configuration";
import { Logger } from "./utils/logging";
import { Rest } from "./SharePoint/Rest/rest";

/**
 * Root class of the Patterns and Practices namespace, provides an entry point to the library
 */
export default class PnP {
    /**
     * Utility methods
     */
    public static util = Util;

    /**
     * The full SharePoint library
     */
    public static sharepoint = new SharePoint();

    /**
     * Provides easy access to the REST interface
     */
    public static sp = new Rest();

    /**
     * Provides access to local and session storage
     */
    public static storage: PnPClientStorage = new PnPClientStorage();

    /**
     * Global configuration instance to which providers can be added
     */
    public static configuration = Configuration;

    /**
     * Global logging instance to which subscribers can be registered and messages written
     */
    public static log = Logger;
}
