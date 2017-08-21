import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class TestSub extends superclass
{
    static getCollectionInstance()
    {
        return Collection;
    }
};

export default M;
