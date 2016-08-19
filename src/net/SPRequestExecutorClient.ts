"use strict";

import { HttpClientImpl } from "./httpClient";

/**
 * Makes requests using the SP.RequestExecutor library.
 */
export class SPRequestExecutorClient implements HttpClientImpl {
    /**
     * Fetches a URL using the SP.RequestExecutor library.
     */
    public fetch(url: string, options: any): Promise<Response> {
        if (typeof SP === "undefined" || typeof SP.RequestExecutor === "undefined") {
            throw new Error("SP.RequestExecutor is undefined. " +
                "Load the SP.RequestExecutor.js library (/_layouts/15/SP.RequestExecutor.js) before loading the PnP JS Core library.");
        }

        let addinWebUrl = url.substring(0, url.indexOf("/_api")),
            executor = new SP.RequestExecutor(addinWebUrl),
            headers: { [key: string]: string; } = {},
            iterator,
            temp;

        if (options.headers && options.headers instanceof Headers) {
            iterator = options.headers.entries();
            temp = iterator.next();
            while (!temp.done) {
                headers[temp.value[0]] = temp.value[1];
                temp = iterator.next();
            }
        } else {
            headers = options.headers;
        }

        return new Promise((resolve, reject) => {

            let requestOptions = {
                error: (error: SP.ResponseInfo) => {
                    reject(this.convertToResponse(error));
                },
                headers: headers,
                method: options.method,
                success: (response: SP.ResponseInfo) => {
                    resolve(this.convertToResponse(response));
                },
                url: url,
            };

            if (options.body) {
                requestOptions["body"] = options.body;
            } else {
                requestOptions["binaryStringRequestBody"] = true;
            }
            executor.executeAsync(requestOptions);
        });
    }

    /**
     * Converts a SharePoint REST API response to a fetch API response.
     */
    private convertToResponse = (spResponse: SP.ResponseInfo): Response => {
        let responseHeaders = new Headers();
        for (let h in spResponse.headers) {
            if (spResponse.headers[h]) {
                responseHeaders.append(h, spResponse.headers[h]);
            }
        }

        return new Response(<any>spResponse.body, {
            headers: responseHeaders,
            status: spResponse.statusCode,
            statusText: spResponse.statusText,
        });
    };
}
