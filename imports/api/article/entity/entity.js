import BaseEntity from '../../../lib/util/base-entity/base-entity.js';
import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class Article extends superclass
{
    static get collection()
    {
        return Collection;
    }

    static check()
    {
        console.dir('it is mixin speaking!');
    }

    check()
    {
        console.dir('it is mixin speaking (instance)!');
    }
};

export default M;
