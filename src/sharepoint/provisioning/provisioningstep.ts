/**
 * Describes a ProvisioningStep 
 */
export class ProvisioningStep {
    private name: string;
    private index: number;
    private objects: any;
    private parameters: any;
    private handler: any;

    /**
     * Executes the ProvisioningStep function
     * 
     * @param dependentPromise The promise the ProvisioningStep is dependent on
     */
    public execute(dependentPromise?) {
        let _handler = new this.handler();
        if (!dependentPromise) {
            return _handler.ProvisionObjects(this.objects, this.parameters);
        }
        return new Promise((resolve, reject) => {
            dependentPromise.then(() => {
                return _handler.ProvisionObjects(this.objects, this.parameters).then(resolve, resolve);
            });
        });
    }

    /**
     * Creates a new instance of the ProvisioningStep class
     */
    constructor(name: string, index: number, objects: any, parameters: any, handler: any) {
        this.name = name;
        this.index = index;
        this.objects = objects;
        this.parameters = parameters;
        this.handler = handler;
    }
}
