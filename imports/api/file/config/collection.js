import BaseCollection from '../../../lib/util/base-collection/base-collection.js';

export default class FileCollection extends BaseCollection
{
    constructor()
    {
        super('file-v2');
    }

    schema()
    {
        return {
            name: {
                type: String,
                optional: false,
            },
            path: {
                type: String,
                optional: false,
            },
        };
    }
}
