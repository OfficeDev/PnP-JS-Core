"use strict";

import { Items } from "./items";
import { Views, View } from "./views";
import { ContentTypes } from "./contenttypes";
import { Fields } from "./fields";
import { Forms } from "./forms";
import { Queryable, QueryableInstance, QueryableCollection } from "./queryable";
import { QueryableSecurable } from "./queryablesecurable";
import { Util } from "../../utils/util";
import { TypedHash } from "../../collections/collections";
import { ControlMode, RenderListData, ChangeQuery, CamlQuery, ChangeLogitemQuery, ListFormData } from "./types";
import { UserCustomActions } from "./usercustomactions";
import { extractOdataId } from "./odata";

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
        let list = new List(this);
        list.concat(`('${id}')`);
        return list;
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
     * Ensures that the specified list exists in the collection (note: settings are not updated if the list exists,
     * not supported for batching)
     *
     * @param title The new list's title
     * @param description The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body
     */
    /*tslint:disable max-line-length */
    public ensure(title: string, description = "", template = 100, enableContentTypes = false, additionalSettings: TypedHash<string | number | boolean> = {}): Promise<ListEnsureResult> {

        if (this.hasBatch) {
            throw new Error("The ensure method is not supported as part of a batch.");
        }

        return new Promise((resolve, reject) => {

            let list: List = this.getByTitle(title);

            list.get().then((d) => resolve({ created: false, list: list, data: d })).catch(() => {

                this.add(title, description, template, enableContentTypes, additionalSettings).then((r) => {
                    resolve({ created: true, list: this.getByTitle(title), data: r.data });
                });

            }).catch((e) => reject(e));
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
            return new List(extractOdataId(json));
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
            return new List(extractOdataId(json));
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
     * Gets the forms in this list
     *
     */
    public get forms(): Forms {
        return new Forms(this);
    }

    /**
     * Gets the default view of this list
     *
     */
    public get defaultView(): QueryableInstance {
        return new QueryableInstance(this, "DefaultView");
    }

    /**
     * Get all custom actions on a site collection
     * 
     */
    public get userCustomActions(): UserCustomActions {
        return new UserCustomActions(this);
    }

    /**
     * Gets the effective base permissions of this list
     *
     */
    public get effectiveBasePermissions(): Queryable {
        return new Queryable(this, "EffectiveBasePermissions");
    }

    /**
     * Gets the event receivers attached to this list
     *
     */
    public get eventReceivers(): QueryableCollection {
        return new QueryableCollection(this, "EventReceivers");
    }

    /**
     * Gets the related fields of this list
     *
     */
    public get relatedFields(): Queryable {
        return new Queryable(this, "getRelatedFields");
    }

    /**
     * Gets the IRM settings for this list
     *
     */
    public get informationRightsManagementSettings(): Queryable {
        return new Queryable(this, "InformationRightsManagementSettings");
    }

    /**
     * Gets a view by view guid id
     *
     */
    public getView(viewId: string): View {
        return new View(this, `getView('${viewId}')`);
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

            let retList: List = this;

            if (properties.hasOwnProperty("Title")) {
                retList = this.getParent(List, this.parentUrl, `getByTitle('${properties["Title"]}')`);
            }

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
    public getChanges(query: ChangeQuery): Promise<any> {

        let postBody = JSON.stringify({ "query": Util.extend({ "__metadata": { "type": "SP.ChangeQuery" } }, query) });

        // don't change "this" instance of the List, make a new one
        let q = new List(this, "getchanges");
        return q.post({ body: postBody });
    }

    /**
     * Returns a collection of items from the list based on the specified query.
     * 
     * @param CamlQuery The Query schema of Collaborative Application Markup 
     * Language (CAML) is used in various ways within the context of Microsoft SharePoint Foundation 
     * to define queries against list data.
     * see:
     * 
     * https://msdn.microsoft.com/en-us/library/office/ms467521.aspx
     *      
     * @param expands A URI with a $expand System Query Option indicates that Entries associated with
     * the Entry or Collection of Entries identified by the Resource Path 
     * section of the URI must be represented inline (i.e. eagerly loaded). 
     * see:
     * 
     * https://msdn.microsoft.com/en-us/library/office/fp142385.aspx
     * 
     * http://www.odata.org/documentation/odata-version-2-0/uri-conventions/#ExpandSystemQueryOption
     */
    public getItemsByCAMLQuery(query: CamlQuery, ...expands: string[]): Promise<any> {

        let postBody = JSON.stringify({ "query": Util.extend({ "__metadata": { "type": "SP.CamlQuery" } }, query) });

        // don't change "this" instance of the List, make a new one
        let q = new List(this, "getitems");

        q = q.expand.apply(q, expands);

        return q.post({ body: postBody });
    }

    /**
     * See: https://msdn.microsoft.com/en-us/library/office/dn292554.aspx
     */
    public getListItemChangesSinceToken(query: ChangeLogitemQuery): Promise<string> {
        let postBody = JSON.stringify({ "query": Util.extend({ "__metadata": { "type": "SP.ChangeLogItemQuery" } }, query) });

        // don't change "this" instance of the List, make a new one
        let q = new List(this, "getlistitemchangessincetoken");
        // note we are using a custom parser to return text as the response is an xml doc
        return q.post({ body: postBody }, { parse(r) { return r.text(); } });
    }

    /**
     * Moves the list to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    public recycle(): Promise<string> {
        this.append("recycle");
        return this.post().then(data => {
            if (data.hasOwnProperty("Recycle")) {
                return data.Recycle;
            } else {
                return data;
            }
        });
    }

    /**
     * Renders list data based on the view xml provided
     */
    public renderListData(viewXml: string): Promise<RenderListData> {
        // don't change "this" instance of the List, make a new one
        let q = new List(this, "renderlistdata(@viewXml)");
        q.query.add("@viewXml", "'" + viewXml + "'");
        return q.post().then(data => {
            // data will be a string, so we parse it again
            data = JSON.parse(data);
            if (data.hasOwnProperty("RenderListData")) {
                return data.RenderListData;
            } else {
                return data;
            }
        });
    }

    /**
     * Gets the field values and field schema attributes for a list item.
     */
    public renderListFormData(itemId: number, formId: string, mode: ControlMode): Promise<ListFormData> {
        // don't change "this" instance of the List, make a new one
        let q = new List(this, "renderlistformdata(itemid=" + itemId + ", formid='" + formId + "', mode=" + mode + ")");
        return q.post().then(data => {
            // data will be a string, so we parse it again
            data = JSON.parse(data);
            if (data.hasOwnProperty("ListData")) {
                return data.ListData;
            } else {
                return data;
            }
        });
    }

    /**
     * Reserves a list item ID for idempotent list item creation.
     */
    public reserveListItemId(): Promise<number> {
        // don't change "this" instance of the List, make a new one
        let q = new List(this, "reservelistitemid");
        return q.post().then(data => {
            if (data.hasOwnProperty("ReserveListItemId")) {
                return data.ReserveListItemId;
            } else {
                return data;
            }
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

export interface ListEnsureResult {
    list: List;
    created: boolean;
    data: any;
}
