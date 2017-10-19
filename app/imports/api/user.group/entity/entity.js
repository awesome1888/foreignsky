import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class UserGroup extends superclass
{
    static _id2code = null;

    static getCollectionInstance()
    {
        return Collection;
    }
};

export default M;
