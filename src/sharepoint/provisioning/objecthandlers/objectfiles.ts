"use strict";

import * as CoreUtil from "../../../utils/util";
import { Util } from "../util";
import { ObjectHandlerBase } from "./ObjectHandlerBase";
import { IFile } from "../schema/ifile";
import { IWebPart } from "../schema/iwebpart";
import { IHiddenView } from "../schema/ihiddenview";

/**
 * Describes the Files Object Handler
 */
export class ObjectFiles extends ObjectHandlerBase {
    /**
     * Creates a new instance of the ObjectFiles class
     */
    constructor() {
        super("Files");
    }

    /**
     * Provisioning Files
     * 
     * @param objects The files to provisiion
     */
    public ProvisionObjects(objects: Array<IFile>) {
        super.scope_started();
        return new Promise((resolve, reject) => {
            const clientContext = SP.ClientContext.get_current();
            const web = clientContext.get_web();
            const fileInfos: Array<IFileInfo> = [];
            let promises = [];
            objects.forEach((obj, index) => {
                promises.push(this.httpClient.fetchRaw(Util.replaceUrlTokens(obj.Src)).then((response) => {
                    return response.text();
                }));
            });
            Promise.all(promises).then((responses: any[]) => {
                responses.forEach((response, index) => {
                    let obj = objects[index];
                    const filename = this.GetFilenameFromFilePath(obj.Dest);
                    const webServerRelativeUrl = _spPageContextInfo.webServerRelativeUrl;
                    const folder = web.getFolderByServerRelativeUrl(`${webServerRelativeUrl}/${this.GetFolderFromFilePath(obj.Dest)}`);
                    let fi: IFileInfo = {
                        Contents: response,
                        Dest: obj.Dest,
                        Filename: filename,
                        Folder: folder,
                        Instance: null,
                        Overwrite: false,
                        Properties: [],
                        RemoveExistingWebParts: true,
                        ServerRelativeUrl: obj.Dest,
                        Src: obj.Src,
                        Views: [],
                        WebParts: [],
                    };

                    CoreUtil.Util.extend(fi, obj);

                    if (fi.Filename.indexOf("Form.aspx") !== -1) {
                        return;
                    }
                    let objCreationInformation = new SP.FileCreationInformation();
                    objCreationInformation.set_overwrite(fi.Overwrite);
                    objCreationInformation.set_url(fi.Filename);
                    objCreationInformation.set_content(new SP.Base64EncodedByteArray());
                    for (let i = 0; i < fi.Contents.length; i++) {
                        objCreationInformation.get_content().append(fi.Contents.charCodeAt(i));
                    }
                    clientContext.load(fi.Folder.get_files().add(objCreationInformation));

                    fileInfos.push(fi);
                });
            });

            clientContext.executeQueryAsync(() => {
                promises = [];
                fileInfos.forEach((fi) => {
                    if (fi.Properties && Object.keys(fi.Properties).length > 0) {
                        promises.push(this.ApplyFileProperties(fi.Dest, fi.Properties));
                    }
                    if (fi.WebParts && fi.WebParts.length > 0) {
                        promises.push(this.AddWebPartsToWebPartPage(fi.Dest, fi.Src, fi.WebParts, fi.RemoveExistingWebParts));
                    }
                });
                Promise.all(promises).then(() => {
                    this.ModifyHiddenViews(objects).then((value) => {
                        super.scope_ended();
                        resolve(value);
                    }, (error) => {
                        super.scope_ended();
                        reject(error);
                    });
                });
            }, (error) => {
                super.scope_ended();
                reject(error);
            });
        });
    }
    private RemoveWebPartsFromFileIfSpecified(
        clientContext: SP.ClientContext,
        limitedWebPartManager: SP.WebParts.LimitedWebPartManager,
        shouldRemoveExisting) {
        return new Promise((resolve, reject) => {
            if (!shouldRemoveExisting) {
                resolve();
            }
            let existingWebParts = limitedWebPartManager.get_webParts();
            clientContext.load(existingWebParts);
            clientContext.executeQueryAsync(
                () => {
                    existingWebParts.get_data().forEach((wp) => {
                        wp.deleteWebPart();
                    });
                    clientContext.load(existingWebParts);
                    clientContext.executeQueryAsync(resolve, reject);
                }, reject);
        });
    }
    private GetWebPartXml(webParts: Array<IWebPart>) {
        return new Promise((resolve, reject) => {
            let promises = [];
            webParts.forEach((wp, index) => {
                if (wp.Contents.FileUrl) {
                    let fileUrl = Util.replaceUrlTokens(wp.Contents.FileUrl);
                    promises.push(this.httpClient.fetchRaw(fileUrl).then((response) => {
                        return response.text();
                    }));
                } else {
                    promises.push((() => {
                        return new Promise((res, rej) => {
                            res();
                        });
                    })());
                }
            });

            Promise.all(promises).then((responses) => {
                responses.forEach((response, index) => {
                    let wp = webParts[index];
                    if (wp !== null && response && response.length > 0) {
                        wp.Contents.Xml = response;
                    }
                });
                resolve(webParts);
            });
        });
    }
    private AddWebPartsToWebPartPage(dest: string, src: string, webParts: Array<IWebPart>, shouldRemoveExisting: Boolean) {
        return new Promise((resolve, reject) => {
            const clientContext = SP.ClientContext.get_current();
            const web = clientContext.get_web();
            let fileServerRelativeUrl = `${_spPageContextInfo.webServerRelativeUrl}/${dest}`;
            let file = web.getFileByServerRelativeUrl(fileServerRelativeUrl);
            clientContext.load(file);
            clientContext.executeQueryAsync(
                () => {
                    let limitedWebPartManager = file.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
                    this.RemoveWebPartsFromFileIfSpecified(clientContext, limitedWebPartManager, shouldRemoveExisting).then(() => {
                        this.GetWebPartXml(webParts).then((webPartsWithXml: Array<IWebPart>) => {
                            webPartsWithXml.forEach(wp => {
                                if (!wp.Contents.Xml) {
                                    return;
                                }
                                let oWebPartDefinition = limitedWebPartManager.importWebPart(Util.replaceUrlTokens(wp.Contents.Xml));
                                let oWebPart = oWebPartDefinition.get_webPart();
                                limitedWebPartManager.addWebPart(oWebPart, wp.Zone, wp.Order);
                            });
                            clientContext.executeQueryAsync(resolve, resolve);
                        });
                    });
                }, resolve);
        });
    }
    private ApplyFileProperties(dest: string, fileProperties: Object) {
        return new Promise((resolve, reject) => {
            const clientContext = SP.ClientContext.get_current();
            const web = clientContext.get_web();
            let fileServerRelativeUrl = `${_spPageContextInfo.webServerRelativeUrl}/${dest}`;
            let file = web.getFileByServerRelativeUrl(fileServerRelativeUrl);
            let listItemAllFields = file.get_listItemAllFields();
            Object.keys(fileProperties).forEach(key => {
                listItemAllFields.set_item(key, fileProperties[key]);
            });
            listItemAllFields.update();
            clientContext.executeQueryAsync(resolve, resolve);
        });
    }
    private GetViewFromCollectionByUrl(viewCollection: SP.ViewCollection, url: string) {
        const serverRelativeUrl = `${_spPageContextInfo.webServerRelativeUrl}/${url}`;
        const viewCollectionEnumerator = viewCollection.getEnumerator();
        while (viewCollectionEnumerator.moveNext()) {
            const view = viewCollectionEnumerator.get_current();
            if (view.get_serverRelativeUrl().toString().toLowerCase() === serverRelativeUrl.toLowerCase()) {
                return view;
            }
        }
        return null;
    }
    private ModifyHiddenViews(objects: Array<IFile>) {
        return new Promise((resolve, reject) => {
            const clientContext = SP.ClientContext.get_current();
            const web = clientContext.get_web();
            let mapping = {};
            let lists: Array<SP.List> = [];
            let listViewCollections: Array<SP.ViewCollection> = [];

            objects.forEach((obj) => {
                if (!obj.Views) {
                    return;
                }
                obj.Views.forEach((v) => {
                    mapping[v.List] = mapping[v.List] || [];
                    mapping[v.List].push(CoreUtil.Util.extend(v, { "Url": obj.Dest }));
                });
            });
            Object.keys(mapping).forEach((l, index) => {
                lists.push(web.get_lists().getByTitle(l));
                listViewCollections.push(web.get_lists().getByTitle(l).get_views());
                clientContext.load(lists[index]);
                clientContext.load(listViewCollections[index]);
            });

            clientContext.executeQueryAsync(
                () => {
                    Object.keys(mapping).forEach((l, index) => {
                        let views: Array<IHiddenView> = mapping[l];
                        let list = lists[index];
                        let viewCollection = listViewCollections[index];
                        views.forEach((v) => {
                            let view = this.GetViewFromCollectionByUrl(viewCollection, v.Url);
                            if (view == null) {
                                return;
                            }
                            if (v.Paged) { view.set_paged(v.Paged); }
                            if (v.Query) { view.set_viewQuery(v.Query); }
                            if (v.RowLimit) { view.set_rowLimit(v.RowLimit); }
                            if (v.ViewFields && v.ViewFields.length > 0) {
                                let columns = view.get_viewFields();
                                columns.removeAll();
                                v.ViewFields.forEach((vf) => {
                                    columns.add(vf);
                                });
                            }
                            view.update();
                        });
                        clientContext.load(viewCollection);
                        list.update();
                    });
                    clientContext.executeQueryAsync(resolve, resolve);
                }, resolve);
        });
    }
    private GetFolderFromFilePath(filePath: string) {
        let split = filePath.split("/");
        return split.splice(0, split.length - 1).join("/");
    }
    private GetFilenameFromFilePath(filePath: string) {
        let split = filePath.split("/");
        return split[split.length - 1];
    }
}



interface IFileInfo extends IFile {
    Filename: string;
    Folder: SP.Folder;
    Contents: string;
    ServerRelativeUrl: string;
    Instance: SP.File;
};
