import { ILoggingOptions } from "./iloggingoptions";
import { IWaitMessageOptions } from "./iwaitmessageoptions";

export interface IOptions {
    WaitMessage?: IWaitMessageOptions;
    Logging?: ILoggingOptions;
}
