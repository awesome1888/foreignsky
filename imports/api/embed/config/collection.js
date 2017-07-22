import Collection from '../../../lib/base/collection/collection.js';
import ItemSchema from './sub-schema/item.js';
import FileCollection from '../../file/config/collection.js';

export default new class extends Collection
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

    get links()
    {
        return {
        };
    }
}
