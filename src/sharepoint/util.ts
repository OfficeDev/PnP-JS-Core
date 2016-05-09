"use strict";
export class Util {
    /**
     * Retrieves the list ID of the current page from _spPageContextInfo
     */
    public static getListId(): string {
        return _spPageContextInfo.hasOwnProperty("pageListId") ? _spPageContextInfo.pageListId.substring(1, 37) : "";
    }

    /**
     * Make URL relative to host
     *
     * @param url The URL to make relative
     */
    public static getRelativeUrl(url: string) {
        return url.replace(`${document.location.protocol}//${document.location.hostname}`, "");
    }

    /**
     * Retrieves the node with the given title from a collection of SP.NavigationNode
     */
    public static getNodeFromCollectionByTitle(nodeCollection: Array<SP.NavigationNode>, title: string) {
        const f = nodeCollection.filter((val: SP.NavigationNode) => {
            return val.get_title() === title;
        });
        return f[0] || null;
    };

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
