"use strict";

import { Util } from "../../util";
import { ObjectHandlerBase } from "./ObjectHandlerBase";
import { INavigation } from "../schema/inavigation";
import { INavigationNode } from "../schema/inavigationnode";
import { HttpClient } from "../../../net/HttpClient";

export class ObjectNavigation extends ObjectHandlerBase {
    constructor() {
        super("Navigation");
    }

    public ProvisionObjects(object: INavigation) {
        super.scope_started();
        let clientContext = SP.ClientContext.get_current();
        let navigation = clientContext.get_web().get_navigation();

        return new Promise((resolve, reject) => {
            this.ConfigureQuickLaunch(object.QuickLaunch, clientContext, this.httpClient, navigation).then(
                () => {
                    super.scope_ended();
                    resolve();
                },
                () => {
                    super.scope_ended();
                    reject();
                });
        });
    }
    private ConfigureQuickLaunch(
        nodes: Array<INavigationNode>,
        clientContext: SP.ClientContext,
        httpClient: HttpClient,
        navigation: SP.Navigation): Promise<any> {
        return new Promise((resolve, reject) => {
            if (nodes.length === 0) {
                resolve();
            } else {
                let quickLaunchNodeCollection = navigation.get_quickLaunch();
                clientContext.load(quickLaunchNodeCollection);
                clientContext.executeQueryAsync(
                    () => {
                        let temporaryQuickLaunch: Array<SP.NavigationNode> = [];
                        let index = quickLaunchNodeCollection.get_count() - 1;
                        while (index >= 0) {
                            const oldNode = quickLaunchNodeCollection.itemAt(index);
                            temporaryQuickLaunch.push(oldNode);
                            oldNode.deleteObject();
                            index--;
                        }
                        clientContext.executeQueryAsync(() => {
                            nodes.forEach((n: INavigationNode) => {
                                const existingNode = Util.getNodeFromCollectionByTitle(temporaryQuickLaunch, n.Title);
                                const newNode = new SP.NavigationNodeCreationInformation();
                                newNode.set_title(n.Title);
                                newNode.set_url(existingNode ? existingNode.get_url() : Util.replaceUrlTokens(n.Url));
                                newNode.set_asLastNode(true);
                                quickLaunchNodeCollection.add(newNode);
                            });
                            clientContext.executeQueryAsync(() => {
                                httpClient.get(`${_spPageContextInfo.webAbsoluteUrl}/_api/web/Navigation/QuickLaunch`).then((data: any) => {
                                    data = data.d.results;
                                    data.forEach((d: any) => {
                                        let node = navigation.getNodeById(d.Id);
                                        let childrenNodeCollection = node.get_children();
                                        let parentNode = nodes.filter((value: any) => { return value.Title === d.Title; })[0];
                                        if (parentNode && parentNode.Children) {
                                            parentNode.Children.forEach((n: INavigationNode) => {
                                                const existingNode = Util.getNodeFromCollectionByTitle(temporaryQuickLaunch, n.Title);
                                                const newNode = new SP.NavigationNodeCreationInformation();
                                                newNode.set_title(n.Title);
                                                newNode.set_url(existingNode ? existingNode.get_url() : Util.replaceUrlTokens(n.Url));
                                                newNode.set_asLastNode(true);
                                                childrenNodeCollection.add(newNode);
                                            });
                                        }
                                    });
                                    clientContext.executeQueryAsync(resolve, resolve);
                                });
                            }, resolve);
                        });
                    });
            }
        });
    }
}
