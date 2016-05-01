"use strict";

import { Queryable } from "./queryable";
import { QuickLaunch } from "./quickLaunch";
import { TopNavigationBar } from "./topNavigationBar";

/**
 * Exposes the navigation components
 * 
 */
export class Navigation extends Queryable {

    /**
     * Creates a new instance of the Lists class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "navigation");
    }

    /**
     * Gets the quicklaunch navigation for the current context
     * 
     */
    public get quicklaunch(): QuickLaunch {
        return new QuickLaunch(this);
    }

    /**
     * Gets the top bar navigation navigation for the current context
     * 
     */
    public get topNavigationBar(): TopNavigationBar {
        return new TopNavigationBar(this);
    }
}
