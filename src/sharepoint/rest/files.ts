"use strict";

import { Queryable, QueryableCollection, QueryableInstance } from "./Queryable";

/**
 * Describes a collection of File objects
 * 
 */
export class Files extends QueryableCollection {

    /**
     * Creates a new instance of the Files class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "files");
    }

    /**
     * Gets a File by filename
     * 
     * @param name The name of the file, including extension
     */
    public getByName(name: string): File {
        this.concat(`('${name}')`);
        return new File(this);
    }
}


/**
 * Describes a single File instance
 * 
 */
export class File extends QueryableInstance {

    /**
     * Creates a new instance of the File class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional, if supplied will be appended to the supplied baseUrl
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }

    /**
     * Gets the contents of the file - If the file is not JSON a custom parser function should be used with the get call
     * 
     */
    public get value(): Queryable {
        this.append("$value");
        return new Queryable(this);
    }

    /**
     * Gets a result indicating the current user who has a file checked out
     * 
     */
    public get checkedOutByUser(): Queryable {
        this.append("CheckedOutByUser");
        return new Queryable(this);
    }

    /**
     * Gets the current eTag of a file
     * 
     */
    public get eTag(): Queryable {
        this.append("ETag");
        return new Queryable(this);
    }

    /**
     * Gets the server relative url of a file
     * 
     */
    public get serverRelativeUrl(): Queryable {
        this.append("ServerRelativeUrl");
        return new Queryable(this);
    }

    /**
     * Gets a collection of versions
     * 
     */
    public get versions(): Versions {
        return new Versions(this);
    }
}


/**
 * Describes a collection of Version objects
 * 
 */
export class Versions extends QueryableCollection {

    /**
     * Creates a new instance of the File class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "versions");
    }

    /**
     * Gets a version by id
     * 
     * @param versionId The id of the version to retrieve
     */
    public getById(versionId: number): Version {
        this.concat(`(${versionId})`);
        return new Version(this);
    }
}


/**
 * Describes a single Version instance
 * 
 */
export class Version extends QueryableInstance {

    /**
     * Creates a new instance of the Version class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional, if supplied will be appended to the supplied baseUrl
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }
}
