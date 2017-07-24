import Collection from '../../../lib/base/collection/collection.js';
import ItemSchema from './sub-schema/item.js';
import OptionSchema from './../../../lib/util/schema/option.js';

export default new class extends Collection
{
    constructor()
    {
        super('embed');
    }

    getSchema()
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
                type: [OptionSchema],
                optional: true,
            },
        };
    }

    getLinks()
    {
        return {
        };
    }
}
