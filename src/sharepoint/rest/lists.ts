"use strict";

import { Items } from "./items";
import { Views, View } from "./views";
import { ContentTypes } from "./contenttypes";
import { Fields } from "./fields";
import { Queryable, QueryableCollection, QueryableSecurable } from "./queryable";
import * as Util from "../../utils/util";
import { ITypedHash } from "../../collections/collections";

/**
 * Describes a collection of List objects
 * 
 */
export class Lists extends QueryableCollection {

    /**
     * Creates a new instance of the Lists class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "lists");
    }

    /**
     * Gets a list from the collection by title
     * 
     * @param title The title of the list 
     */
    public getByTitle(title: string): List {
        return new List(this, `getByTitle('${title}')`);
    }

    /**
     * Gets a list from the collection by guid id
     * 
     * @param title The Id of the list  
     */
    public getById(id: string): List {
        this.concat(`(guid'${id}')`);
        return new List(this);
    }

    /**
     * Adds a new list to the collection
     * 
     * @param title The new list's title
     * @param description The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body
     */
    /*tslint:disable max-line-length */
    public add(title: string, description = "", template = 100, enableContentTypes = false, additionalSettings: ITypedHash<string> = {}): Promise<ListAddResult> {

        let postBody = JSON.stringify(Util.extend({
            "__metadata": { "type": "SP.List" },
            "AllowContentTypes": true,
            "BaseTemplate": template,
            "ContentTypesEnabled": enableContentTypes,
            "Description": description,
            "Title": title,
        }, additionalSettings));

        return this.post({ body: postBody }).then((data) => {
            return {
                list: this.getByTitle(title),
                data: data
            };
        });
    }
    /*tslint:enable */
}


/**
 * Describes a single List instance
 * 
 */
export class List extends QueryableSecurable {

    /**
     * Creates a new instance of the Lists class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional, if supplied will be appended to the supplied baseUrl
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }

    /**
     * Gets the content types in this list
     * 
     */
    public get contentTypes(): ContentTypes {
        return new ContentTypes(this);
    }

    /**
     * Gets the items in this list
     * 
     */
    public get items(): Items {
        return new Items(this);
    }

    /**
     * Gets the views in this list
     * 
     */
    public get views(): Views {
        return new Views(this);
    }

    /**
     * Gets the fields in this list
     * 
     */
    public get fields(): Fields {
        return new Fields(this);
    }

    /**
     * Gets the default view of this list
     * 
     */
    public get defaultView(): Queryable {
        this.append("DefaultViewQueryable");
        return new Queryable(this);
    }

    /**
     * Gets the effective base permissions of this list
     * 
     */
    public get effectiveBasePermissions(): Queryable {
        this.append("EffectiveBasePermissions");
        return new Queryable(this);
    }

    /**
     * Gets the event receivers attached to this list
     * 
     */
    public get eventReceivers(): QueryableCollection {
        this.append("EventReceivers");
        return new QueryableCollection(this);
    }

    /**
     * Gets the related fields of this list
     * 
     */
    public get getRelatedFields(): Queryable {
        this.append("getRelatedFields");
        return new Queryable(this);
    }

    /**
     * Gets the IRM settings for this list
     * 
     */
    public get informationRightsManagementSettings(): Queryable {
        this.append("InformationRightsManagementSettings");
        return new Queryable(this);
    }

    /**
     * Gets the user custom actions attached to this list
     * 
     */
    public get userCustomActions(): Queryable {
        this.append("UserCustomActions");
        return new Queryable(this);
    }

    /**
     * Gets a view by view guid id
     * 
     */
    public getView(viewId: string): View {
        this.append(`getView('${viewId}')`);
        return new View(this);
    }

    /**
     * Updates this list intance with the supplied properties 
     * 
     * 
     */
    public update(properties: ITypedHash<string>): Promise<ListUpdateResult> {

        let postBody = JSON.stringify(Util.extend({
            "__metadata": { "type": "SP.List" },
        }, properties));

        // TODO:: if we update the title, we need to send back a new list based on the new title.

        return this.post({
            body: postBody,
            headers: {
                "IF-Match": "*",
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {
            return {
                data: data,
                list: this,
            };
        });
    }

    /**
     * Delete this list
     * 
     */
    public delete(): Promise<void> {

        return this.post({
            headers: {
                "IF-Match": "*",
                "X-HTTP-Method": "DELETE",
            },
        });
    }
}

export interface ListAddResult {
    list: List;
    data: any;
}

export interface ListUpdateResult {
    list: List;
    data: any;
}
