"use strict";

interface ITaxonomyObject {
    Id: string;
    Name: string;
}

/**
 * Root of the SharePoint TaxonomySession module
 */
export class TaxonomyParser {
    private objects: any;
    private type: string;

    /**
     * Creates a new instance of the TaxonomyParser class
     *
     * @param objects The objects to parse
     * @param type The type of the objects to parse
     */
    constructor(objects: any, type: string) {
        this.objects = objects;
        this.type = type;
    }

    /**
     * Returns the parsed result
     */
    public result(): any {
        if (this.objects.get_data) {
            let res: ITaxonomyObject[] = [];
            this.objects.get_data().forEach(obj => {
                res.push({
                    Id: obj.get_id().toString(),
                    Name: obj.get_name(),
                });
            });
            return res;
        } else {
            let res: ITaxonomyObject = {
                Id: this.objects.get_id().toString(),
                Name: this.objects.get_name(),
            };
            return res;
        };
    }
};
