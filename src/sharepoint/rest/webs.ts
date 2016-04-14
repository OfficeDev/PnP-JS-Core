"use strict";

import { Queryable, QueryableSecurable } from "./Queryable";
import { Lists } from "./lists";
import { RoleAssignments } from "./roleAssignments";
import { Navigation } from "./navigation";
import { SiteUsers } from "./siteUsers";
import { ContentTypes } from "./contentTypes";
import { Folders, Folder } from "./folders";
import { File } from "./files";

/**
 * Describes a web
 * 
 */
export class Web extends QueryableSecurable {

    /**
     * Creates a new instance of the View class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param webPath Optional, specifies the path used to query for the given web, meant for internal use
     */
    constructor(baseUrl: string | Queryable, webPath = "web") {
        super(baseUrl, webPath);
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
}
