"use strict";

import { Items } from "./items";
import { Views, View } from "./views";
import { ContentTypes } from "./contenttypes";
import { Fields } from "./fields";
import { Queryable, QueryableCollection } from "./queryable";
import { QueryableSecurable } from "./QueryableSecurable";
import * as Util from "../../utils/util";
import { TypedHash } from "../../collections/collections";
import * as Types from "./types";

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
    constructor(baseUrl: string | Queryable, path = "lists") {
        super(baseUrl, path);
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
        return new List(this.toUrl().concat(`(guid'${id}')`));
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
    public add(title: string, description = "", template = 100, enableContentTypes = false, additionalSettings: TypedHash<string | number | boolean> = {}): Promise<ListAddResult> {

        let postBody = JSON.stringify(Util.extend({
            "__metadata": { "type": "SP.List" },
            "AllowContentTypes": enableContentTypes,
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

    /**
     * Gets a list that is the default asset location for images or other files, which the users upload to their wiki pages.
     */
    /*tslint:disable member-access */
    public ensureSiteAssetsLibrary(): Promise<List> {
        let q = new Lists(this, "ensuresiteassetslibrary");
        return q.post().then((json) => {
            return new List(<string>json["odata.id"]);
        });
    }
    /*tslint:enable */

    /**
     * Gets a list that is the default location for wiki pages.
     */
    /*tslint:disable member-access */
    public ensureSitePagesLibrary(): Promise<List> {
        let q = new Lists(this, "ensuresitepageslibrary");
        return q.post().then((json) => {
            return new List(<string>json["odata.id"]);
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
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    /* tslint:disable member-access */
    public update(properties: TypedHash<string | number | boolean>, eTag = "*"): Promise<ListUpdateResult> {

        let postBody = JSON.stringify(Util.extend({
            "__metadata": { "type": "SP.List" },
        }, properties));

        return this.post({
            body: postBody,
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {

            let retList = properties.hasOwnProperty("Title") ? new List(this.parentUrl, `getByTitle('${properties["Title"]}')`) : this;

            return {
                data: data,
                list: retList,
            };
        });
    }
    /* tslint:enable */

    /**
     * Delete this list
     * 
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public delete(eTag = "*"): Promise<void> {
        return this.post({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    }

    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query.
     */
    public getChanges(query: Types.ChangeQuery): Promise<any> {

        let postBody = JSON.stringify({ "query": Util.extend({ "__metadata": { "type": "SP.ChangeQuery" } }, query) });

        // don't change "this" instance of the List, make a new one
        let q = new List(this, "getchanges");
        return q.post({ body: postBody });
    }

    /**
     * Returns a collection of items from the list based on the specified query.
     */
    public getItemsByCAMLQuery(query: Types.CamlQuery): Promise<any> {

        let postBody = JSON.stringify({ "query": Util.extend({ "__metadata": { "type": "SP.CamlQuery" } }, query) });

        // don't change "this" instance of the List, make a new one
        let q = new List(this, "getitems");
        return q.post({ body: postBody });
    }

    /**
     * See: https://msdn.microsoft.com/en-us/library/office/dn292554.aspx
     */
    public getListItemChangesSinceToken(query: Types.ChangeLogitemQuery): Promise<string> {
        let postBody = JSON.stringify({ "query": Util.extend({ "__metadata": { "type": "SP.ChangeLogItemQuery" } }, query) });

        // don't change "this" instance of the List, make a new one
        let q = new List(this, "getlistitemchangessincetoken");
        // note we are using a custom parser to return text as the response is an xml doc
        return q.post({ body: postBody }, (r) => r.text());
    }

    /**
     * Moves the list to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    public recycle(): Promise<string> {
        this.append("recycle");
        return this.post();
    }

    /**
     * Renders list data based on the view xml provided
     */
    public renderListData(viewXml: string): Promise<string> {
        // don't change "this" instance of the List, make a new one
        let q = new List(this, "renderlistdata(@viewXml)");
        q.query.add("@viewXml", "'" + viewXml + "'");
        return q.post();
    }

    /**
     * Renders list form data based on parameters provided
     */
    public renderListFormData(itemId: number, formId: string, mode: Types.ControlMode): Promise<string> {
        // don't change "this" instance of the List, make a new one
        let q = new List(this, "renderlistformdata(itemid=" + itemId + ", formid='" + formId + "', mode=" + mode + ")");
        return q.post();
    }

    /**
     * Reserves a list item ID for idempotent list item creation.
     */
    public reserveListItemId(): Promise<number> {
        // don't change "this" instance of the List, make a new one
        let q = new List(this, "reservelistitemid");
        return q.post();
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
