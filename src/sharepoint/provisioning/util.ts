"use strict";
export class Util {
    /**
     * Make URL relative to host
     *
     * @param url The URL to make relative
     */
    public static getRelativeUrl(url: string) {
        return url.replace(`${document.location.protocol}//${document.location.hostname}`, "");
    }

    /**
     * Replaces URL tokens in a string
     */
    public static replaceUrlTokens(url: string) {
        return url.replace(/{site}/g, _spPageContextInfo.webAbsoluteUrl)
            .replace(/{sitecollection}/g, _spPageContextInfo.siteAbsoluteUrl);
    };

    public static encodePropertyKey(propKey) {
        let bytes = [];
        for (let i = 0; i < propKey.length; ++i) {
            bytes.push(propKey.charCodeAt(i));
            bytes.push(0);
        }
        const b64encoded = window.btoa(String.fromCharCode.apply(null, bytes));
        return b64encoded;
    }
}
