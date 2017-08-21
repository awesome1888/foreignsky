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
};

export default M;
