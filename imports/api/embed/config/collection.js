import BaseCollection from '../../../lib/util/base-collection/base-collection.js';
import ItemSchema from './sub-schema/item.js';

export default class EmbedCollection extends BaseCollection
{
    constructor()
    {
        super('embed');
    }

    schema()
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
