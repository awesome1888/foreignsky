import collection from '../config/collection.js';
import map from '../map/map.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class Test extends superclass
{
    static getCollectionInstance()
    {
        return collection;
    }

    static getMapInstance()
    {
        return map;
    }

    static getFullSelect()
    {
        // todo: hard-coded for now, but need to be auto-generated based on schema,
        // todo: auto-select field and links!
        return {
            string: 1,
            stringM: 1,
            date: 1,
            dateM: 1,
            bool: 1,
            boolM: 1,
            num: 1,
            numM: 1,

            schema: 1,
            schemaM: 1,

            ref: {
                title: 1,
                sort: 1,
                color: 1,
                primary: 1,
            },
            refM: {
                title: 1,
                sort: 1,
                color: 1,
                primary: 1,
            },
        };
    }
};

export default M;
