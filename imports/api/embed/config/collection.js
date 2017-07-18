import BaseCollection from '../../../lib/util/base-collection/base-collection.js';
import ItemSchema from './sub-schema/item.js';

export default new class extends BaseCollection
{
    constructor()
    {
        super('embed');
    }

    get schema()
    {
        return {
            item: {
                type: [ItemSchema],
                optional: false,
            },
            renderer: {
                type: String,
                optional: false,
            },
            options: {
                type: Object,
                optional: true,
            },
        };
    }
}
