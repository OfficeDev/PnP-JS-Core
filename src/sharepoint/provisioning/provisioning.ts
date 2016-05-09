"use strict";

import { ProvisioningStep } from "./ProvisioningStep";
import { ObjectNavigation } from "./ObjectHandlers/ObjectNavigation";
import { ObjectPropertyBagEntries } from "./ObjectHandlers/ObjectPropertyBagEntries";
import { ObjectFeatures } from "./ObjectHandlers/ObjectFeatures";
import { ObjectWebSettings } from "./ObjectHandlers/ObjectWebSettings";
import { ObjectComposedLook } from "./ObjectHandlers/ObjectComposedLook";
import { ObjectCustomActions } from "./ObjectHandlers/ObjectCustomActions";
import { ObjectFiles } from "./ObjectHandlers/ObjectFiles";
import { ObjectLists } from "./ObjectHandlers/ObjectLists";
import { Util } from "../../sharepoint/util";
import { Logger } from "../../utils/logging";
import { SiteSchema } from "./schema/isiteschema";
import { HttpClient } from "../../net/HttpClient";

export class Provisioning {

    private handlers;
    private httpClient: HttpClient;
    private startTime;
    private queueItems: Array<ProvisioningStep>;

    constructor() {
        this.handlers = {
            "Navigation": ObjectNavigation,
            "PropertyBagEntries": ObjectPropertyBagEntries,
            "Features": ObjectFeatures,
            "WebSettings": ObjectWebSettings,
            "ComposedLook": ObjectComposedLook,
            "CustomActions": ObjectCustomActions,
            "Files": ObjectFiles,
            "Lists": ObjectLists,
        };
        this.httpClient = new HttpClient();
    }

    public applyTemplate(path: string) {
        const url = Util.replaceUrlTokens(path);

        return new Promise((resolve, reject) => {
            this.httpClient.get(url).then((response) => {
                if (response.ok) {
                    response.json<SiteSchema>().then((template) => {
                        this.start(template, Object.keys(template)).then(resolve, reject);
                    });
                } else {
                    reject(response.statusText);
                }
            }, (error) => {
                Logger.write("Provisioning: The provided template is invalid", Logger.LogLevel.Error);
            });
        });
    }

    private start(json: SiteSchema, queue: Array<string>) {
        return new Promise((resolve, reject) => {
            this.startTime = new Date().getTime();
            this.queueItems = [];

            queue.forEach((q, index) => {
                if (!this.handlers[q]) {
                    return;
                }
                this.queueItems.push(new ProvisioningStep(q, index, json[q], json.Parameters, this.handlers[q]));
            });

            let promises = [];
            promises.push(new Promise(() => {
                Logger.write("Provisioning: Code execution scope started", Logger.LogLevel.Info);
            }));
            let index = 1;
            while (this.queueItems[index - 1] !== undefined) {
                let i = promises.length - 1;
                promises.push(this.queueItems[index - 1].execute(promises[i]));
                index++;
            };

            Promise.all(promises).then((value) => {
                Logger.write("Provisioning: Code execution scope ended", Logger.LogLevel.Info);
                resolve(value);
            }, (error) => {
                Logger.write("Provisioning: Code execution scope ended" + JSON.stringify(error), Logger.LogLevel.Error);
                reject(error);
            });
        });
    }
}
