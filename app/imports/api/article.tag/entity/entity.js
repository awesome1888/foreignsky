import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class Tag extends superclass
{
    static getCollection()
    {
        return Collection;
    }

    getTitle() {
        const t = this.data.title;
        if (_.isString(t))
        {
            return t.toLowerCase();
        }

        return '';
    }

    getColor() {
        return this.data.color || 'blue';
    }
};

export default M;
