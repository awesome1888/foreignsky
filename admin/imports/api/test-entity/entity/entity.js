import collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) => class Test extends superclass
{
    static getCollectionInstance()
    {
        return collection;
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
            fixedSB: 1,

            map: 1,
            mapM: 1,

            link: {
                title: 1,
                sort: 1,
                color: 1,
                primary: 1,
            },
            linkM: {
                title: 1,
                sort: 1,
                color: 1,
                primary: 1,
            },
        };
    }
};

export default M;
