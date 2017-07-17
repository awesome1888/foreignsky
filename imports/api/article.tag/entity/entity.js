import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class Tag extends superclass
{
    static get collection()
    {
        return Collection;
    }
};

export default M;
