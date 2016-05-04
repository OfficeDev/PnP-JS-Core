"use strict";

import { Queryable, QueryableCollection, QueryableInstance } from "./Queryable";
import { Item } from "./items";

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
    constructor(baseUrl: string | Queryable, path = "files") {
        super(baseUrl, path);
    }

    /**
     * Gets a File by filename
     * 
     * @param name The name of the file, including extension.
     */
    public getByName(name: string): File {
        let f = new File(this);
        f.concat(`('${name}')`);
        return f;
    }

    /**
     * Uploads a file.
     * 
     * @param url The folder-relative url of the file.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
     * @param content The file contents blob.
     * @returns The new File and the raw response. 
     */
    public add(url: string, content: Blob, shouldOverWrite = true): Promise<FileAddResult> {
        return new Files(this, `add(overwrite=${shouldOverWrite},url='${url}')`)
            .post({ body: content }).then((response) => {
                return {
                    data: response,
                    file: this.getByName(url),
                };
            });
    }

    /**
     * Adds a ghosted file to an existing list or document library.
     * 
     * @param fileUrl The server-relative url where you want to save the file.
     * @param templateFileType The type of use to create the file.
     * @returns The template file that was added and the raw response.
     */
    public addTemplateFile(fileUrl: string, templateFileType: TemplateFileType): Promise<FileAddResult> {
        return new Files(this, `addTemplateFile(urloffile='${fileUrl}',templatefiletype=${templateFileType})`)
            .post().then((response) => {
                return {
                    data: response,
                    file: this.getByName(fileUrl),
                };
            });
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
     * Gets a value that specifies the user who added the file.
     * 
     */
    public get author(): Queryable {
        return new Queryable(this, "author");
    }

    /**
     * Gets a result indicating the current user who has the file checked out.
     * 
     */
    public get checkedOutByUser(): Queryable {
        return new Queryable(this, "checkedOutByUser");
    }

    /**
     * Gets a value that returns the comment used when a document is checked in to a document library.
     * 
     */
    public get checkInComment(): Queryable {
        return new Queryable(this, "checkInComment");
    }

    /**
     * Gets a value that indicates how the file is checked out of a document library.
     * The checkout state of a file is independent of its locked state.
     * 
     */
    public get checkOutType(): Queryable {
        return new Queryable(this, "checkOutType");
    }

    /**
     * Returns internal version of content, used to validate document equality for read purposes.
     * 
     */
    public get contentTag(): Queryable {
        return new Queryable(this, "contentTag");
    }

    /**
     * Gets a value that specifies the customization status of the file.
     * 
     */
    public get customizedPageStatus(): Queryable {
        return new Queryable(this, "customizedPageStatus");
    }

    /**
     * Gets the current eTag of a file
     * 
     */
    public get eTag(): Queryable {
        return new Queryable(this, "eTag");
    }

    /**
     * Gets a value that specifies whether the file exists.
     * 
     */
    public get exists(): Queryable {
        return new Queryable(this, "exists");
    }

    /**
     * Gets the size of the file in bytes, excluding the size of any Web Parts that are used in the file.
     */
    public get length(): Queryable {
        return new Queryable(this, "length");
    }

    /**
     * Gets a value that specifies the publishing level of the file.
     * 
     */
    public get level(): Queryable {
        return new Queryable(this, "level");
    }

    /**
     * Gets a value that specifies the list item field values for the list item corresponding to the file.
     * 
     */
    public get listItemAllFields(): Item {
        return new Item(this, "listItemAllFields");
    }

    /**
     * Gets a value that returns the user that owns the current lock on the file.
     * 
     */
    public get lockedByUser(): Queryable {
        return new Queryable(this, "lockedByUser");
    }

    /**
     * Gets a value that specifies the major version of the file.
     * 
     */
    public get majorVersion(): Queryable {
        return new Queryable(this, "majorVersion");
    }

    /**
     * Gets a value that specifies the minor version of the file.
     * 
     */
    public get minorVersion(): Queryable {
        return new Queryable(this, "minorVersion");
    }

    /**
     * Gets a value that returns the user who last modified the file.
     * 
     */
    public get modifiedBy(): Queryable {
        return new Queryable(this, "modifiedBy");
    }

    /**
     * Gets the name of the file including the extension.
     * 
     */
    public get name(): Queryable {
        return new Queryable(this, "name");
    }

    /**
     * Gets the server relative url of a file
     * 
     */
    public get serverRelativeUrl(): Queryable {
        return new Queryable(this, "serverRelativeUrl");
    }

    /**
     * Gets a value that specifies when the file was created.
     * 
     */
    public get timeCreated(): Queryable {
        return new Queryable(this, "timeCreated");
    }

    /**
     * Gets a value that specifies when the file was last modified.
     * 
     */
    public get timeLastModified(): Queryable {
        return new Queryable(this, "timeLastModified");
    }

    /**
     * Gets a value that specifies the display name of the file.
     * 
     */
    public get title(): Queryable {
        return new Queryable(this, "title");
    }

    /**
     * Gets a value that specifies the implementation-specific version identifier of the file.
     * 
     */
    public get uiVersion(): Queryable {
        return new Queryable(this, "uiVersion");
    }

    /**
     * Gets a value that specifies the implementation-specific version identifier of the file.
     * 
     */
    public get uiVersionLabel(): Queryable {
        return new Queryable(this, "uiVersionLabel");
    }

    /**
     * Gets a collection of versions
     * 
     */
    public get versions(): Versions {
        return new Versions(this);
    }

    /**
     * Gets the contents of the file - If the file is not JSON a custom parser function should be used with the get call
     * 
     */
    public get value(): Queryable {
        return new Queryable(this, "$value");
    }

    /**
     * Approves the file submitted for content approval with the specified comment.
     * Only documents in lists that are enabled for content approval can be approved.
     * 
     * @param comment The comment for the approval.
     */
    public approve(comment: string): Promise<void> {
        return new File(this, `approve(comment='${comment}')`).post();
    }

    /**
     * Stops the chunk upload session without saving the uploaded data.
     * If the file doesn’t already exist in the library, the partially uploaded file will be deleted.
     * Use this in response to user action (as in a request to cancel an upload) or an error or exception.
     * Use the uploadId value that was passed to the StartUpload method that started the upload session.
     * This method is currently available only on Office 365.
     * 
     * @param uploadId The unique identifier of the upload session.
     */
    public cancelUpload(uploadId: string): Promise<void> {
        return new File(this, `cancelUpload(uploadId=guid'${uploadId}')`).post();
    }

    /**
     * Checks the file in to a document library based on the check-in type.
     * 
     * @param comment A comment for the check-in. Its length must be <= 1023.
     * @param checkinType The check-in type for the file.
     */
    public checkin(comment = "", checkinType = CheckinType.Major): Promise<void> {
        // TODO: Enforce comment length <= 1023
        return new File(this, `checkin(comment='${comment}',checkintype=${checkinType})`).post();
    }

    /**
     * Checks out the file from a document library.
     */
    public checkout(): Promise<void> {
        return new File(this, "checkout").post();
    }

    /**
     * Continues the chunk upload session with an additional fragment.
     * The current file content is not changed.
     * Use the uploadId value that was passed to the StartUpload method that started the upload session.
     * This method is currently available only on Office 365.
     * 
     * @param uploadId The unique identifier of the upload session.
     * @param fileOffset The size of the offset into the file where the fragment starts.
     * @param fragment The file contents.
     * @returns The size of the total uploaded data in bytes. 
     */
    public continueUpload(uploadId: string, fileOffset: number, fragment: Blob): Promise<number> {
        return new File(this, `continueUpload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})`).post({ body: fragment });
    }

    /**
     * Copies the file to the destination url.
     * 
     * @param url The absolute url or server relative url of the destination file path to copy to.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
     */
    public copyTo(url: string, shouldOverWrite = true): Promise<void> {
        return new File(this, `copyTo(strnewurl='${url}',boverwrite=${shouldOverWrite})`).post();
    }

    /**
     * Delete this file.
     * 
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public delete(eTag = "*"): Promise<void> {
        return new File(this).post({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    }

    /**
     * Denies approval for a file that was submitted for content approval.
     * Only documents in lists that are enabled for content approval can be denied.
     * 
     * @param comment The comment for the denial.
     */
    public deny(comment = ""): Promise<void> {
        return new File(this, `deny(comment='${comment}')`).post();
    }

    /**
     * Uploads the last file fragment and commits the file. The current file content is changed when this method completes.
     * Use the uploadId value that was passed to the StartUpload method that started the upload session.
     * This method is currently available only on Office 365.
     * 
     * @param uploadId The unique identifier of the upload session.
     * @param fileOffset The size of the offset into the file where the fragment starts.
     * @param fragment The file contents.
     * @returns The newly uploaded file. 
     */
    public finishUpload(uploadId: string, fileOffset: number, fragment: Blob): Promise<FileAddResult> {
        return new File(this, `finishUpload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})`)
            .post({ body: fragment }).then((response) => {
                return {
                    data: response,
                    file: new File(response.ServerRelativeUrl),
                };
            });
    }

    /**
     * Specifies the control set used to access, modify, or add Web Parts associated with this Web Part Page and view.
     * An exception is thrown if the file is not an ASPX page.
     * 
     * @param scope The WebPartsPersonalizationScope view on the Web Parts page.
     */
    public getLimitedWebPartManager(scope = WebPartsPersonalizationScope.User): Queryable {
        return new Queryable(this, `getLimitedWebPartManager(scope=${scope})`);
    }

    /**
     * Moves the file to the specified destination url.
     * 
     * @param url The absolute url or server relative url of the destination file path to move to.
     * @param moveOperations The bitwise MoveOperations value for how to move the file.
     */
    public moveTo(url: string, moveOperations = MoveOperations.Overwrite): Promise<void> {
        return new File(this, `moveTo(newurl='${url}',flags=${moveOperations})`).post();
    }

    /**
     * Opens the file as a stream.
     * 
     */
    public openBinaryStream(): Queryable {
        return new Queryable(this, "openBinaryStream");
    }

    /**
     * Submits the file for content approval with the specified comment.
     * 
     * @param comment The comment for the published file. Its length must be <= 1023.
     */
    public publish(comment = ""): Promise<void> {
        return new File(this, `publish(comment='${comment}')`).post();
    }

    /**
     * Moves the file to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     * 
     * @returns The GUID of the recycled file.
     */
    public recycle(): Promise<string> {
        return new File(this, "recycle").post();
    }

    /**
     * Uploads a binary file.
     * 
     * @data The file contents.
     */
    public saveBinaryStream(data: Blob): Promise<void> {
        return new File(this, "saveBinary").post({ body: data });
    }

    /**
     * Starts a new chunk upload session and uploads the first fragment.
     * The current file content is not changed when this method completes.
     * The method is idempotent (and therefore does not change the result) as long as you use the same values for uploadId and stream.
     * The upload session ends either when you use the CancelUpload method or when you successfully
     * complete the upload session by passing the rest of the file contents through the ContinueUpload and FinishUpload methods.
     * The StartUpload and ContinueUpload methods return the size of the running total of uploaded data in bytes,
     * so you can pass those return values to subsequent uses of ContinueUpload and FinishUpload.
     * This method is currently available only on Office 365.
     * 
     * @param uploadId The unique identifier of the upload session.
     * @param fragment The file contents.
     * @returns The size of the total uploaded data in bytes. 
     */
    public startUpload(uploadId: string, fragment: Blob): Promise<number> {
        return new File(this, `startUpload(uploadId=guid'${uploadId}')`).post({ body: fragment });
    }

    /**
     * Reverts an existing checkout for the file.
     * 
     */
    public undoCheckout(): Promise<void> {
        return new File(this, "undoCheckout").post();
    }

    /**
     * Removes the file from content approval or unpublish a major version.
     * 
     * @param comment The comment for the unpublish operation. Its length must be <= 1023.
     */
    public unpublish(comment = ""): Promise<void> {
        // TODO: Enforce comment length <= 1023
        return new File(this, `unpublish(comment='${comment}')`).post();
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
    constructor(baseUrl: string | Queryable, path = "versions") {
        super(baseUrl, path);
    }

    /**
     * Gets a version by id
     * 
     * @param versionId The id of the version to retrieve
     */
    public getById(versionId: number): Version {
        let v = new Version(this);
        v.concat(`(${versionId})`);
        return v;
    }

    /**
     * Deletes all the file version objects in the collection.
     * 
     */
    public deleteAll(): Promise<void> {
        return new Versions(this, "deleteAll").post();
    }

    /**
     * Deletes the specified version of the file.
     * 
     * @param versionId The ID of the file version to delete.
     */
    public deleteById(versionId: number): Promise<void> {
        return new Versions(this, `deleteById(vid=${versionId})`).post();
    }

    /**
     * Deletes the file version object with the specified version label.
     * 
     * @param label The version label of the file version to delete, for example: 1.2
     */
    public deleteByLabel(label: string): Promise<void> {
        return new Versions(this, `deleteByLabel(versionlabel='${label}')`).post();
    }

    /**
     * Creates a new file version from the file specified by the version label.
     * 
     * @param label The version label of the file version to restore, for example: 1.2
     */
    public restoreByLabel(label: string): Promise<void> {
        return new Versions(this, `restoreByLabel(versionlabel='${label}')`).post();
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

    /**
     * Gets a value that specifies the check-in comment.
     * 
     */
    public get checkInComment(): Queryable {
        return new Queryable(this, "checkInComment");
    }

    /**
     * Gets a value that specifies the creation date and time for the file version.
     * 
     */
    public get created(): Queryable {
        return new Queryable(this, "created");
    }

    /**
     * Gets a value that specifies the user that represents the creator of the file version.
     * 
     */
    public get createdBy(): Queryable {
        return new Queryable(this, "createdBy");
    }

    /**
     * Gets the internal identifier for the file version.
     * 
     */
    public get id(): Queryable {
        return new Queryable(this, "id");
    }

    /**
     * Gets a value that specifies whether the file version is the current version.
     * 
     */
    public get isCurrentVersion(): Queryable {
        return new Queryable(this, "isCurrentVersion");
    }

    /**
     * Gets a value that specifies the size of this version of the file.
     * 
     */
    public get size(): Queryable {
        return new Queryable(this, "size");
    }

    /**
     * Gets a value that specifies the relative URL of the file version based on the URL for the site or subsite.
     * 
     */
    public get url(): Queryable {
        return new Queryable(this, "url");
    }

    /**
     * Gets a value that specifies the implementation specific identifier of the file.
     * Uses the majorVersionNumber.minorVersionNumber format, for example: 1.2
     * 
     */
    public get versionLabel(): Queryable {
        return new Queryable(this, "versionLabel");
    }

     /**
     * Delete a specific version of a file.
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
}

export enum CheckinType {
    Minor = 0,
    Major = 1,
    Overwrite = 2
}

export interface FileAddResult {
    file: File;
    data: any;
}

export enum WebPartsPersonalizationScope {
    User = 0,
    Shared = 1
}

export enum MoveOperations {
    Overwrite = 1,
    AllowBrokenThickets = 8
}

export enum TemplateFileType {
    StandardPage = 0,
    WikiPage = 1,
    FormPage = 2
}
