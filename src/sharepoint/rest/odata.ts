"use strict";

import { QueryableConstructor } from "./queryable";
import { Util } from "../../utils/util";
import { Logger, LogLevel } from "../../utils/logging";
import { HttpClient } from "../../net/httpclient";
import { RuntimeConfig } from "../../configuration/pnplibconfig";
import { TypedHash } from "../../collections/collections";

export function extractOdataId(candidate: any): string {

    if (candidate.hasOwnProperty("odata.id")) {
        return candidate["odata.id"];
    } else if (candidate.hasOwnProperty("__metadata") && candidate.__metadata.hasOwnProperty("id")) {
        return candidate.__metadata.id;
    } else {
        Logger.log({
            data: candidate,
            level: LogLevel.Error,
            message: "Could not extract odata id in object, you may be using nometadata. Object data logged to logger.",
        });
        throw new Error("Could not extract odata id in object, you may be using nometadata. Object data logged to logger.");
    }
}

export interface ODataParser<T, U> {
    parse(r: Response): Promise<U>;
}

export abstract class ODataParserBase<T, U> implements ODataParser<T, U> {

    public parse(r: Response): Promise<U> {
        return r.json().then(json => this.parseODataJSON(json));
    }

    protected parseODataJSON<U>(json: any): U {
        let result = json;
        if (json.hasOwnProperty("d")) {
            if (json.d.hasOwnProperty("results")) {
                result = json.d.results;
            } else {
                result = json.d;
            }
        } else if (json.hasOwnProperty("value")) {
            result = json.value;
        }
        return result;
    }
}

export class ODataDefaultParser extends ODataParserBase<any, any> {
}

export class ODataRawParserImpl implements ODataParser<any, any> {
    public parse(r: Response): Promise<any> {
        return r.json();
    }
}

class ODataValueParserImpl<T> extends ODataParserBase<any, T> {
    public parse(r: Response): Promise<T> {
        return super.parse(r).then(d => d as T);
    }
}

class ODataEntityParserImpl<T> extends ODataParserBase<T, T> {

    constructor(protected factory: QueryableConstructor<T>) {
        super();
    }

    public parse(r: Response): Promise<T> {
        return super.parse(r).then(d => {
            let o = new this.factory(getEntityUrl(d), null);
            return Util.extend(o, d);
        });
    }
}

class ODataEntityArrayParserImpl<T> extends ODataParserBase<T, T[]> {

    constructor(protected factory: QueryableConstructor<T>) {
        super();
    }

    public parse(r: Response): Promise<T[]> {
        return super.parse(r).then((d: any[]) => {
            return d.map(v => {
                let o = new this.factory(getEntityUrl(v), null);
                return Util.extend(o, v);
            });
        });
    }
}

function getEntityUrl(entity: any): string {

    if (entity.hasOwnProperty("__metadata")) {
        // we are dealing with verbose, which has an absolute uri
        return entity.__metadata.uri;
    } else if (entity.hasOwnProperty("odata.editLink")) {
        // we are dealign with minimal metadata (default)
        return Util.combinePaths("_api", entity["odata.editLink"]);
    } else {
        // we are likely dealing with nometadata, so don't error but we won't be able to
        // chain off these objects (write something to log?)
        Logger.write("No uri information found in ODataEntity parsing, chaining will fail for this object.", LogLevel.Warning);
        return "";
    }
}

export let ODataRaw = new ODataRawParserImpl();

export function ODataValue<T>(): ODataParser<any, T> {
    return new ODataValueParserImpl<T>();
}

export function ODataEntity<T>(factory: QueryableConstructor<T>): ODataParser<T, T> {
    return new ODataEntityParserImpl(factory);
}

export function ODataEntityArray<T>(factory: QueryableConstructor<T>): ODataParser<T, T[]> {
    return new ODataEntityArrayParserImpl<T>(factory);
}

/**
 * Manages a batch of OData operations
 */
export class ODataBatch {

    private _batchDependencies: Promise<void>;
    private _requests: ODataBatchRequestInfo[];

    constructor(private baseUrl: string, private _batchId = Util.getGUID()) {
        this._requests = [];
        this._batchDependencies = Promise.resolve();
    }

    /**
     * Adds a request to a batch (not designed for public use)
     * 
     * @param url The full url of the request
     * @param method The http method GET, POST, etc
     * @param options Any options to include in the request
     * @param parser The parser that will hadle the results of the request
     */
    public add<U>(url: string, method: string, options: any, parser: ODataParser<any, U>): Promise<U> {

        let info = {
            method: method.toUpperCase(),
            options: options,
            parser: parser,
            reject: null,
            resolve: null,
            url: url,
        };

        let p = new Promise<U>((resolve, reject) => {
            info.resolve = resolve;
            info.reject = reject;
        });

        this._requests.push(info);

        return p;
    }

    public addBatchDependency(): () => void {

        let resolver: () => void;
        let promise = new Promise<void>((resolve) => {
            resolver = resolve;
        });

        this._batchDependencies = this._batchDependencies.then(() => promise);

        return resolver;
    }

    /**
     * Execute the current batch and resolve the associated promises
     * 
     * @returns A promise which will be resolved once all of the batch's child promises have resolved
     */
    public execute(): Promise<void> {
        return this._batchDependencies.then(() => this.executeImpl());
    }

    private executeImpl(): Promise<void> {

        // if we don't have any requests, don't bother sending anything
        // this could be due to caching further upstream, or just an empty batch 
        if (this._requests.length < 1) {
            return Promise.resolve();
        }

        // build all the requests, send them, pipe results in order to parsers
        let batchBody: string[] = [];

        let currentChangeSetId = "";

        this._requests.forEach((reqInfo, index) => {

            if (reqInfo.method === "GET") {

                if (currentChangeSetId.length > 0) {
                    // end an existing change set
                    batchBody.push(`--changeset_${currentChangeSetId}--\n\n`);
                    currentChangeSetId = "";
                }

                batchBody.push(`--batch_${this._batchId}\n`);

            } else {

                if (currentChangeSetId.length < 1) {
                    // start new change set
                    currentChangeSetId = Util.getGUID();
                    batchBody.push(`--batch_${this._batchId}\n`);
                    batchBody.push(`Content-Type: multipart/mixed; boundary="changeset_${currentChangeSetId}"\n\n`);
                }

                batchBody.push(`--changeset_${currentChangeSetId}\n`);
            }

            // common batch part prefix
            batchBody.push(`Content-Type: application/http\n`);
            batchBody.push(`Content-Transfer-Encoding: binary\n\n`);

            let headers = {
                "Accept": "application/json;",
            };

            if (reqInfo.method !== "GET") {

                let method = reqInfo.method;

                if (reqInfo.options && reqInfo.options.headers && reqInfo.options.headers["X-HTTP-Method"] !== typeof undefined) {
                    method = reqInfo.options.headers["X-HTTP-Method"];
                    delete reqInfo.options.headers["X-HTTP-Method"];
                }

                batchBody.push(`${method} ${reqInfo.url} HTTP/1.1\n`);

                headers = Util.extend(headers, { "Content-Type": "application/json;odata=verbose;charset=utf-8" });

            } else {
                batchBody.push(`${reqInfo.method} ${reqInfo.url} HTTP/1.1\n`);
            }

            if (typeof RuntimeConfig.headers !== "undefined") {
                headers = Util.extend(headers, RuntimeConfig.headers);
            }

            if (reqInfo.options && reqInfo.options.headers) {
                headers = Util.extend(headers, reqInfo.options.headers);
            }

            for (let name in headers) {
                if (headers.hasOwnProperty(name)) {
                    batchBody.push(`${name}: ${headers[name]}\n`);
                }
            }

            batchBody.push("\n");

            if (reqInfo.options.body) {
                batchBody.push(`${reqInfo.options.body}\n\n`);
            }
        });

        if (currentChangeSetId.length > 0) {
            // Close the changeset
            batchBody.push(`--changeset_${currentChangeSetId}--\n\n`);
            currentChangeSetId = "";
        }

        batchBody.push(`--batch_${this._batchId}--\n`);

        let batchHeaders: TypedHash<string> = {
            "Content-Type": `multipart/mixed; boundary=batch_${this._batchId}`,
        };

        let batchOptions = {
            "body": batchBody.join(""),
            "headers": batchHeaders,
        };

        let client = new HttpClient();
        let requestUrl = Util.makeUrlAbsolute(Util.combinePaths(this.baseUrl, "/_api/$batch"));
        return client.post(requestUrl, batchOptions)
            .then(r => r.text())
            .then(this._parseResponse)
            .then(responses => {
                if (responses.length !== this._requests.length) {
                    // this is unfortunate
                    throw new Error("Could not properly parse responses to match requests in batch.");
                }

                let chain = Promise.resolve();

                for (let i = 0; i < responses.length; i++) {
                    let request = this._requests[i];
                    let response = responses[i];

                    if (!response.ok) {
                        request.reject(new Error(response.statusText));
                    }

                    chain = chain.then(_ => request.parser.parse(response).then(request.resolve).catch(request.reject));
                }

                return chain;
            });
    }

    /**
     * Parses the response from a batch request into an array of Response instances
     * 
     * @param body Text body of the response from the batch request
     */
    private _parseResponse(body: string): Promise<Response[]> {
        return new Promise((resolve, reject) => {
            let responses = [];
            let header = "--batchresponse_";
            // Ex. "HTTP/1.1 500 Internal Server Error"
            let statusRegExp = new RegExp("^HTTP/[0-9.]+ +([0-9]+) +(.*)", "i");
            let lines = body.split("\n");
            let state = "batch";
            let status;
            let statusText;
            for (let i = 0; i < lines.length; ++i) {
                let line = lines[i];
                switch (state) {
                    case "batch":
                        if (line.substr(0, header.length) === header) {
                            state = "batchHeaders";
                        } else {
                            if (line.trim() !== "") {
                                throw new Error("Invalid response, line " + i);
                            }
                        }
                        break;
                    case "batchHeaders":
                        if (line.trim() === "") {
                            state = "status";
                        }
                        break;
                    case "status":
                        let parts = statusRegExp.exec(line);
                        if (parts.length !== 3) {
                            throw new Error("Invalid status, line " + i);
                        }
                        status = parseInt(parts[1], 10);
                        statusText = parts[2];
                        state = "statusHeaders";
                        break;
                    case "statusHeaders":
                        if (line.trim() === "") {
                            state = "body";
                        }
                        break;
                    case "body":
                        let response = void 0;
                        if (status === 204) {
                            // https://github.com/whatwg/fetch/issues/178
                            response = new Response();
                        } else {
                            response = new Response(line, { status: status, statusText: statusText });
                        }
                        responses.push(response);
                        state = "batch";
                        break;
                }
            }
            if (state !== "status") {
                reject(new Error("Unexpected end of input"));
            }
            resolve(responses);
        });
    }
}

interface ODataBatchRequestInfo {
    url: string;
    method: string;
    options: any;
    parser: ODataParser<any, any>;
    resolve: (d: any) => void;
    reject: (error: any) => void;
}

export class TextFileParser implements ODataParser<any, string> {

    public parse(r: Response): Promise<string> {
        return r.text();
    }
}

export class BlobFileParser implements ODataParser<any, Blob> {

    public parse(r: Response): Promise<Blob> {
        return r.blob();
    }
}

export class JSONFileParser implements ODataParser<any, any> {

    public parse(r: Response): Promise<any> {
        return r.json();
    }
}

export class BufferFileParser implements ODataParser<any, ArrayBuffer> {

    public parse(r: any): Promise<ArrayBuffer> {

        if (Util.isFunction(r.arrayBuffer)) {
            return r.arrayBuffer();
        }

        return r.buffer();
    }
}
