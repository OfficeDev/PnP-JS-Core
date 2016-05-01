"use strict";

import * as Collections from "../collections/Collections";
import * as Args from "./args";

/**
 * A set of logging levels
 * 
 */
export enum LogLevel {
    Verbose = 0,
    Info = 1,
    Warning = 2,
    Error = 3,
    Off = 99
}

/**
 * Interface that defines a log entry
 * 
 */
export interface LogEntry {
    /**
     * The main message to be logged
     */
    message: string;
    /**
     * The level of information this message represents
     */
    level: LogLevel;
    /**
     * Any associated data that a given logging listener may choose to log or ignore
     */
    data?: Collections.TypedHash<string>;
}

/**
 * Interface that defines a log listner
 * 
 */
export interface LogListener {
    /**
     * Any associated data that a given logging listener may choose to log or ignore
     * 
     * @param entry The information to be logged 
     */
    log(entry: LogEntry): void;
}

/**
 * Class used to subscribe ILogListener and log messages throughout an application
 * 
 */
export class Logger {

    private static _instance: LoggerImpl;

    private static get instance(): LoggerImpl {
        if (typeof Logger._instance === "undefined" || Logger._instance === null) {
            Logger._instance = new LoggerImpl();
        }
        return Logger._instance;
    }

    /**
     * Adds an ILogListener instance to the set of subscribed listeners
     * 
     */
    public static subscribe(listener: LogListener): void {
        Logger.instance.subscribe(listener);
    }

    /**
     * Clears the subscribers collection, returning the collection before modifiction
     */
    public static clearSubscribers(): LogListener[] {
        return Logger.instance.clearSubscribers();
    }

    /** 
     * Gets the current subscriber count
     */
    public static get count(): number {
        return Logger.instance.count;
    }

    /**
     * Writes the supplied string to the subscribed listeners
     * 
     * @param message The message to write
     * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Verbose)
     */
    public static write(message: string, level: LogLevel = LogLevel.Verbose) {
        Logger.instance.log({ level: level, message: message });
    }

    /**
     * Logs the supplied entry to the subscribed listeners
     * 
     * @param entry The message to log
     */
    public static log(entry: LogEntry) {
        Logger.instance.log(entry);
    }

    /**
     * Logs performance tracking data for the the execution duration of the supplied function using console.profile
     * 
     * @param name The name of this profile boundary
     * @param f The function to execute and track within this performance boundary
     */
    public static measure<T>(name: string, f: () => T): T {
        return Logger.instance.measure(name, f);
    }
}

class LoggerImpl {

    constructor(public activeLogLevel: LogLevel = LogLevel.Warning, private subscribers: LogListener[] = []) { }

    public subscribe(listener: LogListener): void {

        Args.objectIsNull(listener, "listener");

        this.subscribers.push(listener);
    }

    public clearSubscribers(): LogListener[] {
        let s = this.subscribers.slice(0);
        this.subscribers.length = 0;
        return s;
    }

    public get count(): number {
        return this.subscribers.length;
    }

    public write(message: string, level: LogLevel = LogLevel.Verbose) {
        this.log({ level: level, message: message });
    }

    public log(entry: LogEntry) {

        Args.objectIsNull(entry, "entry");

        if (entry.level < this.activeLogLevel) {
            return;
        }

        for (let i = 0; i < this.subscribers.length; i++) {
            this.subscribers[i].log(entry);
        }
    }

    public measure<T>(name: string, f: () => T): T {
        console.profile(name);
        try {
            return f();
        } finally {
            console.profileEnd();
        }
    }
}

/**
 * Implementation of ILogListener which logs to the browser console
 * 
 */
export class ConsoleListener implements LogListener {

    /**
     * Any associated data that a given logging listener may choose to log or ignore
     * 
     * @param entry The information to be logged 
     */
    public log(entry: LogEntry): void {

        let msg = this.format(entry);

        switch (entry.level) {
            case LogLevel.Verbose:
            case LogLevel.Info:
                console.log(msg);
                break;
            case LogLevel.Warning:
                console.warn(msg);
                break;
            case LogLevel.Error:
                console.error(msg);
                break;
        }
    }

    /**
     * Formats the message
     * 
     * @param entry The information to format into a string
     */
    private format(entry: LogEntry): string {
        return "Message: " + entry.message + ". Data: " + JSON.stringify(entry.data);
    }
}

/* tslint:disable */
/**
 * Implementation of ILogListener which logs to Azure Insights
 * 
 */
export class AzureInsightsListener implements LogListener {

    /** 
     * Creats a new instance of the AzureInsightsListener class
     * 
     * @constructor
     * @param azureInsightsInstrumentationKey The instrumentation key created when the Azure Insights instance was created
     */
    constructor(private azureInsightsInstrumentationKey: string) {
        Args.stringIsNullOrEmpty(azureInsightsInstrumentationKey, "azureInsightsInstrumentationKey");

        let appInsights = window["appInsights"] || function (config) {
            function r(config) {
                t[config] = function () {
                    let i = arguments;
                    t.queue.push(function () { t[config].apply(t, i) });
                }
            }
            let t: any = { config: config }, u = document, e: any = window, o = "script", s: any = u.createElement(o), i, f;
            for (s.src = config.url || "//az416426.vo.msecnd.net/scripts/a/ai.0.js", u.getElementsByTagName(o)[0].parentNode.appendChild(s), t.cookie = u.cookie, t.queue = [], i = ["Event", "Exception", "Metric", "PageView", "Trace"]; i.length;) {
                r("track" + i.pop());
            }
            return r("setAuthenticatedUserContext"), r("clearAuthenticatedUserContext"), config.disableExceptionTracking || (i = "onerror", r("_" + i), f = e[i], e[i] = function (config, r, u, e, o) {
                let s = f && f(config, r, u, e, o);
                return s !== !0 && t["_" + i](config, r, u, e, o), s
            }), t
        } ({
            instrumentationKey: this.azureInsightsInstrumentationKey
        });

        window["appInsights"] = appInsights;
    }

    /**
     * Any associated data that a given logging listener may choose to log or ignore
     * 
     * @param entry The information to be logged 
     */
    public log(entry: LogEntry): void {
        let ai: any = window["appInsights"];
        let msg = this.format(entry);
        if (entry.level === LogLevel.Error) {
            ai.trackException(msg);
        } else {
            ai.trackEvent(msg);
        }
    }

    /**
     * Formats the message
     * 
     * @param entry The information to format into a string
     */
    private format(entry: LogEntry): string {
        return "Message: " + entry.message + ". Data: " + JSON.stringify(entry.data);
    }
}
/* tslint:enable */

/**
 * Implementation of ILogListener which logs to the supplied function
 * 
 */
export class FunctionListener implements LogListener {

    /** 
     * Creates a new instance of the FunctionListener class
     * 
     * @constructor
     * @param  method The method to which any logging data will be passed
     */
    constructor(private method: (entry: LogEntry) => void) { }

    /**
     * Any associated data that a given logging listener may choose to log or ignore
     * 
     * @param entry The information to be logged 
     */
    public log(entry: LogEntry): void {
        this.method(entry);
    }
}
