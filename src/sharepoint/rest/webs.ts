"use strict";

import { Queryable, QueryableInstance, QueryableCollection } from "./Queryable";
import { QueryableSecurable } from "./QueryableSecurable";
import { Lists } from "./lists";
import { RoleAssignments } from "./roleAssignments";
import { Navigation } from "./navigation";
import { SiteUsers } from "./siteUsers";
import { ContentTypes } from "./contentTypes";
import { Folders, Folder } from "./folders";
import { File } from "./files";
import { TypedHash } from "../../collections/collections";
import * as Util from "../../utils/util";
import * as Types from "./types";
import { List } from "./lists";


export class Webs extends QueryableCollection {
    constructor(baseUrl: string | Queryable, webPath = "webs") {
        super(baseUrl, webPath);
    }

    /**
     * Adds a new web to the collection
     * 
     * @param title The new web's title
     * @param url The new web's relative url
     * @param description The web web's description
     * @param template The web's template
     * @param language The language code to use for this web
     * @param inheritPermissions If true permissions will be inherited from the partent web
     * @param additionalSettings Will be passed as part of the web creation body
     */
    public add(
        title: string,
        url: string,
        description = "",
        template = "STS",
        language = 1033,
        inheritPermissions = true,
        additionalSettings: TypedHash<string | number | boolean> = {}): Promise<WebAddResult> {

        let props = Util.extend({
            Description: description,
            Language: language,
            Title: title,
            Url: url,
            UseSamePermissionsAsParentSite: inheritPermissions,
            WebTemplate: template,
        }, additionalSettings);

        let postBody = JSON.stringify({
            "parameters":
            Util.extend({
                "__metadata": { "type": "SP.WebCreationInformation" },
            }, props),
        });

        let q = new Webs(this, "add");
        return q.post({ body: postBody }).then((data) => {
            return {
                data: data,
                web: new Web(this, props.Url),
            };
        });
    }
}


/**
 * Describes a web
 * 
 */
export class Web extends QueryableSecurable {

    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }

    public get webs(): Webs {
        return new Webs(this);
    }

    /**
     * Get the content types available in this web
     * 
     */
    public get contentTypes(): ContentTypes {
        return new ContentTypes(this);
    }

    /**
     * Get the role assignments applied to this web
     * 
     */
    public get roleAssignments(): RoleAssignments {
        return new RoleAssignments(this);
    }

    /**
     * Get the lists in this web
     * 
     */
    public get lists(): Lists {
        return new Lists(this);
    }

    /**
     * Get the navigation options in this web
     * 
     */
    public get navigation(): Navigation {
        return new Navigation(this);
    }

    /**
     * Gets the site users
     * 
     */
    public get siteUsers(): SiteUsers {
        return new SiteUsers(this);
    }

    /**
     * Get the folders in this web
     * 
     */
    public get folders(): Folders {
        return new Folders(this);
    }

    /**
     * Get a folder by server relative url
     * 
     * @param folderRelativeUrl the server relative path to the folder (including /sites/ if applicable)
     */
    public getFolderByServerRelativeUrl(folderRelativeUrl: string): Folder {
        return new Folder(this, `getFolderByServerRelativeUrl('${folderRelativeUrl}')`);
    }

    /**
     * Get a file by server relative url
     * 
     * @param fileRelativeUrl the server relative path to the file (including /sites/ if applicable)
     */
    public getFileByServerRelativeUrl(fileRelativeUrl: string): File {
        return new File(this, `getFileByServerRelativeUrl('${fileRelativeUrl}')`);
    }

    /**
     * Updates this web intance with the supplied properties 
     * 
     * @param properties A plain object hash of values to update for the web
     */
    public update(properties: TypedHash<string | number | boolean>): Promise<WebUpdateResult> {

        let postBody = JSON.stringify(Util.extend({
            "__metadata": { "type": "SP.Web" },
        }, properties));

        return this.post({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {
            return {
                data: data,
                web: this,
            };
        });
    }

    /**
     * Delete this web
     * 
     */
    public delete(): Promise<void> {
        return this.post({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    }

    /**
     * Applies the theme specified by the contents of each of the files specified in the arguments to the site.
     * 
     * @param colorPaletteUrl Server-relative URL of the color palette file.
     * @param fontSchemeUrl Server-relative URL of the font scheme.
     * @param backgroundImageUrl Server-relative URL of the background image.
     * @param shareGenerated true to store the generated theme files in the root site, or false to store them in this site.
     */
    public applyTheme(colorPaletteUrl: string, fontSchemeUrl: string, backgroundImageUrl: string, shareGenerated: boolean): Promise<void> {

        let postBody = JSON.stringify({
            backgroundImageUrl: backgroundImageUrl,
            colorPaletteUrl: colorPaletteUrl,
            fontSchemeUrl: fontSchemeUrl,
            shareGenerated: shareGenerated,
        });

        let q = new Web(this, "applytheme");
        return q.post({ body: postBody });
    }

    /**
     * Applies the specified site definition or site template to the Web site that has no template applied to it.
     * 
     * @param template Name of the site definition or the name of the site template
     */
    public applyWebTemplate(template: string): Promise<void> {
        let q = new Web(this, "applywebtemplate");
        q.concat(`(@t)`);
        q.query.add("@t", template);
        return q.post();
    }

    /**
     * Returns whether the current user has the given set of permissions.
     * 
     * @param perms The high and low permission range.
     */
    public doesUserHavePermissions(perms: Types.BasePermissions): Promise<boolean> {
        let q = new Web(this, "doesuserhavepermissions");
        q.concat(`(@p)`);
        q.query.add("@p", JSON.stringify(perms));
        return q.get();
    }

    /**
     * Checks whether the specified login name belongs to a valid user in the site. If the user doesn't exist, adds the user to the site.
     * 
     * @param loginName The login name of the user (ex: i:0#.f|membership|user@domain.onmicrosoft.com)
     */
    public ensureUser(loginName: string): Promise<any> {
        // TODO:: this should resolve to a User

        let postBody = JSON.stringify({
            logonName: loginName,
        });

        let q = new Web(this, "ensureuser");
        return q.post({ body: postBody });
    }

    /**
     * Returns a collection of site templates available for the site.
     * 
     * @param language The LCID of the site templates to get.
     * @param true to include language-neutral site templates; otherwise false
     */
    public availableWebTemplates(language = 1033, includeCrossLanugage = true): QueryableCollection {
        return new QueryableCollection(this, `getavailablewebtemplates(lcid=${language} doincludecrosslanguage=${includeCrossLanugage})`);
    }

    /**
     * Returns the list gallery on the site.
     * 
     * @param type The gallery type
     */
    /* tslint:disable member-access */
    public getCatalog(type: number): Promise<List> {
        let q = new Web(this, `getcatalog(${type})`);
        q.select("Id");
        return q.get().then((data) => {
            debugger;
            return new List(data["odata.id"]);
        });
    }
    /* tslint:enable */

    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query.
     */
    public getChanges(query: Types.ChangeQuery): Promise<any> {

        let postBody = JSON.stringify({ "query": Util.extend({ "__metadata": { "type": "SP.ChangeQuery" } }, query) });

        // don't change "this" instance of the List, make a new one
        let q = new Web(this, "getchanges");
        return q.post({ body: postBody });
    }

    /**
     * Gets the custom list templates for the site.
     * 
     */
    public get customListTemplate(): QueryableCollection {
        return new QueryableCollection(this, "getcustomlisttemplates");
    }

    /**
     * Returns the user corresponding to the specified member identifier for the current site.
     * 
     * @param id The ID of the user.
     */
    public getUserById(id: number): QueryableInstance {
        // TODO:: should return a User
        return new QueryableInstance(this, `getUserById(${id})`);
    }

    /**
     * Returns the name of the image file for the icon that is used to represent the specified file.
     * 
     * @param filename The file name. If this parameter is empty, the server returns an empty string.
     * @param size The size of the icon: 16x16 pixels = 0, 32x32 pixels = 1.
     * @param progId The ProgID of the application that was used to create the file, in the form OLEServerName.ObjectName 
     */
    public mapToIcon(filename: string, size = 0, progId = ""): Promise<string> {
        let q = new Web(this, `maptoicon(filename='${filename}', progid='${progId}', size=${size})`);
        return q.get();
    }
}

export interface WebAddResult {
    data: any;
    web: Web;
}

export interface WebUpdateResult {
    data: any;
    web: Web;
}

export interface GetCatalogResult {
    data: any;
    list: List;
}
