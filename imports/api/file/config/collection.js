import BaseCollection from '../../../lib/util/base-collection/base-collection.js';

export default new class extends BaseCollection
{
    constructor()
    {
        super('file');
    }

    get schema()
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
