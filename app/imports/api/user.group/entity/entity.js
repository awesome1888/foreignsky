import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class UserGroup extends superclass
{
    static getCollectionInstance()
    {
        return Collection;
    }
};

export default M;
