/// <reference path="..\..\..\..\typings\main.d.ts" />
"use strict";

export class Logger {
    private isLoggerDefined;
    constructor() {
        this.isLoggerDefined = false;
        if (console && console.log) {
            this.isLoggerDefined = true;
        }
    }
    public info(object: string, message: string): void {
        this.print(`${new Date()},\t\t[${object}], [Information], [${message}]`);
    }
    // TODO this can be DRYd
    public debug(object: string, message: string): void {
        this.print(`${new Date()},\t\t[${object}], [Debug], [${message}]`);
    }
    public error(object: string, message: string): void {
        this.print(`${new Date()},\t\t[${object}], [Error], [${message}]`);
    }
    private print(msg: string): void {
        if (this.isLoggerDefined) {
            console.log(msg);
        }
    }
}
