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

    get title()
    {
        return this.data.title || '';
    }

    get text()
    {
        return this.data.text || '';
    }

    get date()
    {
        return this.data.date || null;
    }

    get headerColor()
    {
        return this.data.headerColor || 'white';
    }

    hasHeaderImage()
    {
        return _.isObjectNotEmpty(this.data.headerImage);
    }
};

export default M;
