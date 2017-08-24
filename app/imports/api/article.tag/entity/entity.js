import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class Tag extends superclass
{
    static getCollectionInstance()
    {
        return Collection;
    }

    getTitle() {
        const t = this._data.title;
        if (_.isString(t))
        {
            return t.toLowerCase();
        }

        return '';
    }

    getColor() {
        return this._data.color || 'blue';
    }
};

export default M;
