"use strict";

import { IComposedLook } from "../schema/icomposedlook";
import { Util } from "../util";
import { ObjectHandlerBase } from "./ObjectHandlerBase";

/**
 * Describes the Composed Look Object Handler
 */
export class ObjectComposedLook extends ObjectHandlerBase {
    /**
     * Creates a new instance of the ObjectComposedLook class
     */
    constructor() {
        super("ComposedLook");
    }

    /**
     * Provisioning Composed Look
     * 
     * @param object The Composed Look to provision
     */
    public ProvisionObjects(object: IComposedLook) {
        super.scope_started();
        return new Promise((resolve, reject) => {
            let clientContext = SP.ClientContext.get_current();
            let web = clientContext.get_web();
            let colorPaletteUrl = object.ColorPaletteUrl ? Util.replaceUrlTokens(object.ColorPaletteUrl) : "";
            let fontSchemeUrl = object.FontSchemeUrl ? Util.replaceUrlTokens(object.FontSchemeUrl) : "";
            let backgroundImageUrl = object.BackgroundImageUrl ? Util.replaceUrlTokens(object.BackgroundImageUrl) : null;
            web.applyTheme(Util.getRelativeUrl(colorPaletteUrl), Util.getRelativeUrl(fontSchemeUrl), backgroundImageUrl, true);
            web.update();
            clientContext.executeQueryAsync(
                () => {
                    super.scope_ended();
                    resolve();
                }, () => {
                    super.scope_ended();
                    resolve();
                });
        });
    }
}

