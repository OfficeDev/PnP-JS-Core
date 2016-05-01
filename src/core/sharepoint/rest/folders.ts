"use strict";

import { Queryable, QueryableCollection, QueryableInstance } from "./Queryable";
import { Files } from "./files";

/**
 * Describes a collection of Folder objects
 * 
 */
export class Folders extends QueryableCollection {

    /**
     * Creates a new instance of the Folders class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "folders");
    }

    /**
     * Gets a folder by folder name
     * 
     */
    public getByName(name: string): Folder {
        return new Folder(this.toUrl().concat(`('${name}')`));
    }
}

/**
 * Describes a single Folder instance
 * 
 */
export class Folder extends QueryableInstance {

    /**
     * Creates a new instance of the Folder class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional, if supplied will be appended to the supplied baseUrl
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }

    /**
     * Gets the parent folder, if available
     * 
     */
    public get parentFolder() {
        return new Folder(this, "ParentFolder");
    }

    /**
     * Gets this folder's sub folders
     * 
     */
    public get folders(): Folders {
        return new Folders(this);
    }

    /**
     * Gets the folders name
     * 
     */
    public get name(): Queryable {
        return new Queryable(this, "Name");
    }

    /**
     * Gets this folder's properties
     * 
     */
    public get properties(): QueryableInstance {
        return new QueryableInstance(this, "Properties");
    }

    /**
     * Gets this folder's server relative url
     * 
     */
    public get serverRelativeUrl(): Queryable {
        return new Queryable(this, "ServerRelativeUrl");
    }

    /**
     * Gets this folder's files
     * 
     */
    public get files(): Files {
        return new Files(this);
    }
}
