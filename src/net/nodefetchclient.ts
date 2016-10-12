"use strict";

declare var global: any;
declare var require: (path: string) => any;
let nodeFetch = require("node-fetch");
import { HttpClientImpl } from "./httpclient";
import { Util } from "../utils/util";
import * as url from "url";
import { getAuth, IAuthOptions } from "node-sp-auth";
import * as https from "https";

/**
 * Fetch client for use within nodejs, requires you register a client id and secret with app only permissions
 */
export class NodeFetchClient implements HttpClientImpl {

    constructor(public siteUrl: string, private credentials: IAuthOptions) {

        // here we "cheat" and set the globals for fetch things when this client is instantiated
        global.Headers = nodeFetch.Headers;
        global.Request = nodeFetch.Request;
        global.Response = nodeFetch.Response;
    }

    public fetch(requesturl: string, options: any): Promise<Response> {

        if (!Util.isUrlAbsolute(requesturl)) {
            requesturl = Util.combinePaths(this.siteUrl, requesturl);
        }

        return getAuth(requesturl, this.credentials).then(authResult => {

            if (authResult.options && (<any>authResult.options).agent) {
                options.agent = (<any>authResult.options).agent;
            } else {
                let isHttps: boolean = url.parse(requesturl).protocol === "https:";
                if (isHttps) {
                    // bypassing ssl errors like self-signed ssl certifcate, etc, especially for on-premise
                    options.agent = new https.Agent({ rejectUnauthorized: false });
                }
            }

            /* assign headers */
            for (let propName in authResult.headers) {
                if ((<any>authResult.headers).hasOwnProperty(propName)) {
                    options.headers.set(propName, authResult.headers[propName]);
                }
            }

            return nodeFetch(requesturl, options);
        });
    }
}
