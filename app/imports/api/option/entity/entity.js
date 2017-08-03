import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class Option extends superclass
{
    static get collection() {
        return Collection;
    }
};

export default M;
