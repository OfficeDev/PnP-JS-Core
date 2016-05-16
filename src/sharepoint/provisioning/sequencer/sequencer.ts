/**
 * Descibes a Sequencer
 */
export class Sequencer {
    private functions: Array<any>;
    private parameter: any;
    private scope: any;

    /**
     * Creates a new instance of the Sequencer class
     */
    constructor(__functions: any, __parameter: any, __scope: any) {
        this.parameter = __parameter;
        this.scope = __scope;
        this.functions = this.deferredArray(__functions);
    }

    /**
     * Executes the functions in sequence using DeferredObject
     */
    public execute() {
        return new Promise((resolve, reject) => {
            let promises = [];
            let index = 1;
            promises.push(new Promise(
                () => {
                    if (index < 1) {
                        index = 1;
                    }
                }
            ));
            while (this.functions[index - 1] !== undefined) {
                let i = promises.length - 1;
                promises.push(this.functions[index - 1].execute(promises[i]));
                index++;
            };
            Promise.all(promises).then(resolve, reject);
        });
    }

    /**
     * Creates an array of DeferredObject from an array of functions
     * 
     * @param __functions The array of functions
     */
    private deferredArray(__functions: Array<Function>) {
        let functions: Array<DeferredObject> = [];
        __functions.forEach(f => functions.push(new DeferredObject(f, this.parameter, this.scope)));
        return functions;
    }
}

/**
 * Descibes a DeferredObject 
 */
class DeferredObject {
    private func: any;
    private parameter: any;
    private scope: any;

    /**
     * Creates a new instance of the DeferredObject class
     */
    constructor(func, parameter, scope) {
        this.func = func;
        this.parameter = parameter;
        this.scope = scope;
    }

    /**
     * Executes the function
     * 
     * @param depFunc The dependent function
     */
    public execute(depFunc?) {
        if (!depFunc) {
            return this.func.apply(this.scope, [this.parameter]);
        }
        return new Promise((resolve, reject) => {
            depFunc.then(() => {
                this.func.apply(this.scope, [this.parameter]).then(resolve, resolve);
            });
        });
    }
}
