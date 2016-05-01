"use strict";

import { IConfigurationProvider } from "../../../src/core/configuration/configuration";
import { TypedHash } from "../../../src/core/collections/collections";

export default class MockConfigurationProvider implements IConfigurationProvider {
    public shouldThrow: boolean = false;
    public shouldReject: boolean = false;

    constructor(public mockValues?: TypedHash<string>) { }

    public getConfiguration(): Promise<TypedHash<string>> {
        if (this.shouldThrow) {
            throw new Error("Mocked error");
        }

        return new Promise<TypedHash<string>>((resolve, reject) => {
            if (this.shouldReject) {
                reject("Mocked rejection");
            } else {
                resolve(this.mockValues);
            }
        });
    }
}
