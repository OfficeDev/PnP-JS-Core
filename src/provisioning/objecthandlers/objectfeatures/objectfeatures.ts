"use strict";

// import { Promise } from "es6-promise";
import { ObjectHandlerBase } from "../ObjectHandlerBase/ObjectHandlerBase";
import { IFeature } from "../schema/ifeature";

export class ObjectFeatures extends ObjectHandlerBase {
    constructor() {
        super("Features");
    }
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
