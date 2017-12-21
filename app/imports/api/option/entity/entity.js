import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class Option extends superclass
{
    static getCollectionInstance() {
        return Collection;
    }

    getName()
    {
        return this.getData().name || '';
    }

    getValue()
    {
        return this.getData().value.value;
    }

    getPublic()
    {
        return this.getData().public;
    }

    isPublic()
    {
        return !!this.getPublic();
    }
};

export default M;
