/**
 * Descibes a Sequencer
 */
export class Sequencer {
    /**
     * Creates a new instance of the Sequencer class, and declare private variables
     */
    constructor(private functions:Array<any>, private parameter:any, private scope:any) {
    }

    /**
     * Executes the functions in sequence using DeferredObject
     */
    public execute(progressFunction:any) {
        const thisSequencer = this;//a meaningful name for the this scope
        var promiseSequence = Promise.resolve();// empty promise to chain on
        thisSequencer.functions.forEach( (sequenceFunction, functionNr) =>{
            promiseSequence = promiseSequence.then(function () {// Chain function call onto the sequence
                //console.info('executing function:',functionNr);
                return sequenceFunction.call(thisSequencer.scope, thisSequencer.parameter);
            }).then(function (result) {// Resolve for each function call
                if (progressFunction) progressFunction.call(thisSequencer, functionNr, thisSequencer.functions);
                //console.info('finished function:',functionNr,'of',thisSequencer.functions);
            });
        });
        return promiseSequence;// This will resolve after the entire chain is resolved
    }
}
