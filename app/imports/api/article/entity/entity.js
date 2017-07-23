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

    get headerImage()
    {
        return this.data.headerImage || {};
    }

    get tag()
    {
        this.data.tag = this.makeInstances(this.data.tag, 'tag');
        return this.data.tag;
    }

    get embed()
    {
        this.data.embed = this.makeInstances(this.data.embed, 'embed');
        return this.data.embed;
    }

    hasHeaderImage()
    {
        return _.isObjectNotEmpty(this.headerImage);
    }
};

export default M;
