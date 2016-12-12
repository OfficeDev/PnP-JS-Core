"use strict";

import { Util } from "./utils/util";
import { PnPClientStorage } from "./utils/storage";
import { Settings } from "./configuration/configuration";
import { Logger } from "./utils/logging";
import { Rest } from "./sharepoint/rest/rest";
import { Taxonomy } from "./sharepoint/taxonomy/taxonomy";
import { setRuntimeConfig, LibraryConfiguration } from "./configuration/pnplibconfig";

/**
 * Root class of the Patterns and Practices namespace, provides an entry point to the library
 */

/**
 * Utility methods
 */
export const util = Util;

/**
 * Provides access to the REST interface
 */
export const sp = new Rest();

/**
     * Provides access to the Taxonomy interface
*/
export const taxonomy = new Taxonomy();

/**
 * Provides access to local and session storage
 */
export const storage: PnPClientStorage = new PnPClientStorage();

/**
 * Global configuration instance to which providers can be added
 */
export const config = new Settings();

/**
 * Global logging instance to which subscribers can be registered and messages written
 */
export const log = Logger;

/**
 * Allows for the configuration of the library
 */
export const setup: (config: LibraryConfiguration) => void = setRuntimeConfig;

/**
 * Expose a subset of classes from the library for public consumption
 */
export * from "./types/index";

// creating this class instead of directly assigning to default fixes issue #116
let Def = {
    /**
     * Global configuration instance to which providers can be added
     */
    config: config,
    /**
     * Global logging instance to which subscribers can be registered and messages written
     */
    log: log,
    /**
     * Provides access to local and session storage
     */
    setup: setup,
    /**
     * Provides access to the REST interface
     */
    sp: sp,
    /**
     * Provides access to local and session storage
     */
    storage: storage,
    /**
     * Provides access to the Taxonomy interface
    */
    taxonomy: taxonomy,
    /**
     * Utility methods
     */
    util: util,
};

/**
 * Enables use of the import pnp from syntax
 */
export default Def;
