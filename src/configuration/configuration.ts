"use strict";

import * as Collections from "../collections/collections";
import * as providers from "./providers/providers";

/**
 * Interface for configuration providers
 * 
 */
export interface IConfigurationProvider {

    /**
     * Gets the configuration from the provider
     */
    getConfiguration(): Promise<Collections.TypedHash<string>>;
}

/** 
 * Class used to manage the current application settings
 * 
 */
export class Settings {

    /**
     * Creates a new instance of the settings class
     * 
     * @constructor
     */
    constructor() {
        this._settings = new Collections.Dictionary<string>();
    }

    /**
     * Set of pre-defined providers which are available from this library
     */
    public Providers = providers;

    /** 
     * The settings currently stored in this instance
     */
    private _settings: Collections.Dictionary<string>;

    /**
     * Adds a new single setting, or overwrites a previous setting with the same key
     * 
     * @param {string} key The key used to store this setting
     * @param {string} value The setting value to store
     */
    public add(key: string, value: string) {
        this._settings.add(key, value);
    }

    /**
     * Adds a JSON value to the collection as a string, you must use getJSON to rehydrate the object when read
     * 
     * @param {string} key The key used to store this setting
     * @param {any} value The setting value to store
     */
    public addJSON(key: string, value: any) {
        this._settings.add(key, JSON.stringify(value));
    }

    /**
     * Applies the supplied hash to the setting collection overwriting any existing value, or created new values
     * 
     * @param {Collections.TypedHash<any>} hash The set of values to add
     */
    public apply(hash: Collections.TypedHash<any>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this._settings.merge(hash);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Loads configuration settings into the collection from the supplied provider and returns a Promise
     * 
     * @param {IConfigurationProvider} provider The provider from which we will load the settings
     */
    public load(provider: IConfigurationProvider): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            provider.getConfiguration().then((value) => {
                this._settings.merge(value);
                resolve();
            }).catch((reason) => {
                reject(reason);
            });
        });
    }

    /** 
     * Gets a value from the configuration
     * 
     * @param {string} key The key whose value we want to return. Returns null if the key does not exist
     * @return {string} string value from the configuration
     */
    public get(key: string): string {
        return this._settings.get(key);
    }

    /**
     * Gets a JSON value, rehydrating the stored string to the original object
     * 
     * @param {string} key The key whose value we want to return. Returns null if the key does not exist
     * @return {any} object from the configuration
     */
    public getJSON(key: string): any {
        let o = this.get(key);
        if (typeof o === "undefined" || o === null) {
            return o;
        }

        return JSON.parse(o);
    }
}
