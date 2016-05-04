import { HttpClient } from "../../../net/HttpClient";
import { Logger } from "../../../utils/logging";

export class ObjectHandlerBase {

    public httpClient: HttpClient;
    private name: string;

    constructor(name: string) {
        this.name = name;
        this.httpClient = new HttpClient();
    }

    public ProvisionObjects(objects: any, parameters?) {
        return new Promise((resolve, reject) => { resolve("Not implemented."); });
    }

    public scope_started() {
        Logger.write(`Provisioning: ${this.name} Code execution scope started`);
    }

    public scope_ended() {
        Logger.write(`Provisioning: ${this.name} Code execution scope stopped`);
    }
}
