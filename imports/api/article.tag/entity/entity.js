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

    get title() {
        const t = this.data.title;
        if (_.isString(t))
        {
            return t.toLowerCase();
        }

        return '';
    }

    get color() {
        return this.data.color || 'blue';
    }
};

export default M;
