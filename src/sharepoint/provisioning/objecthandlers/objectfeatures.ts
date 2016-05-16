"use strict";

import { ObjectHandlerBase } from "./ObjectHandlerBase";
import { IFeature } from "../schema/ifeature";

/**
 * Describes the Features Object Handler
 */
export class ObjectFeatures extends ObjectHandlerBase {
    /**
     * Creates a new instance of the ObjectFeatures class
     */
    constructor() {
        super("Features");
    }

    /**
     * Provisioning features
     * 
     * @paramm features The features to provision
     */
    public ProvisionObjects(features: Array<IFeature>) {
        super.scope_started();
        return new Promise((resolve, reject) => {
            const clientContext = SP.ClientContext.get_current();
            const web = clientContext.get_web();
            let webFeatures = web.get_features();

            features.forEach(f => {
                if (f.Deactivate === true) {
                    webFeatures.remove(new SP.Guid(f.ID), true);
                } else {
                    webFeatures.add(new SP.Guid(f.ID), true, SP.FeatureDefinitionScope.none);
                }
            });
            web.update();
            clientContext.load(webFeatures);
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
