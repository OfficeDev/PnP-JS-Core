"use strict";

import { Queryable, QueryableCollection, QueryableInstance } from "./queryable";
import { Item } from "./items";
import { TextFileParser, BlobFileParser, JSONFileParser, BufferFileParser } from "./odata";
import { Util } from "../../utils/util";

export interface ChunkedFileUploadProgressData {
    stage: "starting" | "continue" | "finishing";
    blockNumber: number;
    totalBlocks: number;
    chunkSize: number;
    currentPointer: number;
    fileSize: number;
}

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
     * @param content The file contents blob.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten? (default: true)
     * @returns The new File and the raw response. 
     */
    public add(url: string, content: Blob, shouldOverWrite = true): Promise<FileAddResult> {
        return new Files(this, `add(overwrite=${shouldOverWrite},url='${url}')`)
            .post({
                body: content,
            }).then((response) => {
                return {
                    data: response,
                    file: this.getByName(url),
                };
            });
    }

    /**
     * Uploads a file.
     * 
     * @param url The folder-relative url of the file.
     * @param content The Blob file content to add
     * @param progress A callback function which can be used to track the progress of the upload
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten? (default: true)
     * @param chunkSize The size of each file slice, in bytes (default: 10485760)
     * @returns The new File and the raw response. 
     */
    public addChunked(
        url: string,
        content: Blob,
        progress?: (data: ChunkedFileUploadProgressData) => void,
        shouldOverWrite = true,
        chunkSize = 10485760): Promise<FileAddResult> {
        let adder = new Files(this, `add(overwrite=${shouldOverWrite},url='${url}')`);
        return adder.post().then(() => this.getByName(url)).then(file => file.setContentChunked(content, progress, chunkSize)).then((response) => {
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
     * Gets a value that specifies the list item field values for the list item corresponding to the file.
     * 
     */
    public get listItemAllFields(): Item {
        return new Item(this, "listItemAllFields");
    }

    /**
     * Gets a collection of versions
     * 
     */
    public get versions(): Versions {
        return new Versions(this);
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
        if (comment.length > 1023) {
            throw new Error("The maximum comment length is 1023 characters.");
        }
        return new File(this, `unpublish(comment='${comment}')`).post();
    }

    /**
     * Gets the contents of the file as text
     * 
     */
    public getText(): Promise<string> {

        return new File(this, "$value").get(new TextFileParser(), { headers: { "binaryStringResponseBody": "true" } });
    }

    /**
     * Gets the contents of the file as a blob, does not work in Node.js
     * 
     */
    public getBlob(): Promise<Blob> {

        return new File(this, "$value").get(new BlobFileParser(), { headers: { "binaryStringResponseBody": "true" } });
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    public getBuffer(): Promise<ArrayBuffer> {

        return new File(this, "$value").get(new BufferFileParser(), { headers: { "binaryStringResponseBody": "true" } });
    }

    /**
     * Gets the contents of a file as an ArrayBuffer, works in Node.js
     */
    public getJSON(): Promise<any> {

        return new File(this, "$value").get(new JSONFileParser(), { headers: { "binaryStringResponseBody": "true" } });
    }

    /**
     * Sets the content of a file, for large files use setContentChunked
     * 
     * @param content The file content
     * 
     */
    public setContent(content: string | ArrayBuffer | Blob): Promise<File> {

        let setter = new File(this, "$value");

        return setter.post({
            body: content,
            headers: {
                "X-HTTP-Method": "PUT",
            },
        }).then(_ => new File(this));
    }

    /**
     * Sets the contents of a file using a chunked upload approach
     * 
     * @param file The file to upload
     * @param progress A callback function which can be used to track the progress of the upload
     * @param chunkSize The size of each file slice, in bytes (default: 10485760)
     */
    public setContentChunked(
        file: Blob,
        progress?: (data: ChunkedFileUploadProgressData) => void,
        chunkSize = 10485760): Promise<File> {

        if (typeof progress === "undefined") {
            progress = (data) => null;
        }

        let self = this;
        let fileSize = file.size;

        let blockCount = parseInt((file.size / chunkSize).toString(), 10) + ((file.size % chunkSize === 0) ? 1 : 0);
        console.log(`blockCount: ${blockCount}`);

        let uploadId = Util.getGUID();

        // start the chain with the first fragment
        progress({ blockNumber: 1, chunkSize: chunkSize, currentPointer: 0, fileSize: fileSize, stage: "starting", totalBlocks: blockCount });

        let chain = self.startUpload(uploadId, file.slice(0, chunkSize));

        // skip the first and last blocks
        for (let i = 2; i < blockCount; i++) {

            chain = chain.then(pointer => {

                progress({ blockNumber: i, chunkSize: chunkSize, currentPointer: pointer, fileSize: fileSize, stage: "continue", totalBlocks: blockCount });

                return self.continueUpload(uploadId, pointer, file.slice(pointer, pointer + chunkSize));
            });

        }

        return chain.then(pointer => {

            progress({ blockNumber: blockCount, chunkSize: chunkSize, currentPointer: pointer, fileSize: fileSize, stage: "finishing", totalBlocks: blockCount });

            return self.finishUpload(uploadId, pointer, file.slice(pointer));

        }).then(_ => {

            return self;
        });
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
    private startUpload(uploadId: string, fragment: ArrayBuffer | Blob): Promise<number> {
        return new File(this, `startUpload(uploadId=guid'${uploadId}')`).postAs<any, string>({ body: fragment }).then(n => parseFloat(n));
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
    private continueUpload(uploadId: string, fileOffset: number, fragment: ArrayBuffer | Blob): Promise<number> {
        return new File(this, `continueUpload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})`).postAs<any, string>({ body: fragment }).then(n => parseFloat(n));
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
    private finishUpload(uploadId: string, fileOffset: number, fragment: ArrayBuffer | Blob): Promise<FileAddResult> {
        return new File(this, `finishUpload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})`)
            .postAs<any, { ServerRelativeUrl: string }>({ body: fragment }).then((response) => {
                return {
                    data: response,
                    file: new File(response.ServerRelativeUrl),
                };
            });
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
