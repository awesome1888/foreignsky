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

    getTitle()
    {
        return this.data.title || '';
    }

    getText()
    {
        return this.data.text || '';
    }

    getDate()
    {
        return this.data.date || null;
    }

    getHeaderColor()
    {
        return this.data.headerColor || 'white';
    }

    getHeaderImage()
    {
        return this.data.headerImage || {};
    }

    getTag()
    {
        this.data.tag = this.makeInstances(this.data.tag, 'tag');
        return this.data.tag;
    }

    getEmbed()
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
