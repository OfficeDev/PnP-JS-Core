import {IConfigurationProvider} from "../configuration";
import {TypedHash} from "../../collections/collections";
import { default as CachingConfigurationProvider } from "./cachingConfigurationProvider";
import { Web } from "../../sharepoint/rest/webs";
import * as Util from "../../utils/util";

/** 
 * A configuration provider which loads configuration values from a SharePoint list
 *
 */
export default class SPListConfigurationProvider implements IConfigurationProvider {
    /**
     * Creates a new SharePoint list based configuration provider
     * @constructor
     * @param {string} webUrl Url of the SharePoint site, where the configuration list is located
     * @param {string} listTitle Title of the SharePoint list, which contains the configuration settings (optional, default = "config")
     */
    constructor(private webUrl: string, private listTitle = "config") {
    }

    /**
     * Gets the url of the SharePoint site, where the configuration list is located
     * 
     * @return {string} Url address of the site
     */
    public getWebUrl(): string {
        return this.webUrl;
    }

    /**
     * Gets the title of the SharePoint list, which contains the configuration settings
     * 
     * @return {string} List title
     */
    public getListTitle(): string {
        return this.listTitle;
    }

    /**
     * Loads the configuration values from the SharePoint list
     * 
     * @return {Promise<TypedHash<string>>} Promise of loaded configuration values
     */
    public getConfiguration(): Promise<TypedHash<string>> {

        let web = new Web(Util.combinePaths(this.webUrl, "_api"));
        return web.lists.getByTitle(this.listTitle).items.select("Title", "Value").get().then(function (data) {
            let configuration: TypedHash<string> = {};
            data.forEach(i => {
                configuration[i.Title] = i.Value;
            });
            return configuration;
        });
    }

    /**
     * Wraps the current provider in a cache enabled provider
     * 
     * @return {CachingConfigurationProvider} Caching providers which wraps the current provider
     */
    public asCaching(): CachingConfigurationProvider {
        let cacheKey = `splist_${this.webUrl}+${this.listTitle}`;
        return new CachingConfigurationProvider(this, cacheKey);
    }
}
