"use strict";

import { Util } from "./utils/Util";
import { PnPClientStorage } from "./utils/Storage";
import { Settings } from "./configuration/configuration";
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
     * Provides easy access to the REST interface
     */
    public static sp = new Rest();

    /**
     * Provides access to local and session storage
     */
    public static storage = new PnPClientStorage();

    /**
     * Global configuration instance to which providers can be added
     */
    public static config = new Settings();

    /**
     * Global logging instance to which subscribers can be registered and messages written
     */
    public static log = Logger;
}
