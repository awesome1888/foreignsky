import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class Article extends superclass
{
    static getCollectionInstance()
    {
        return Collection;
    }

    getTitle()
    {
        return this.getData().title || '';
    }

    getText()
    {
        return this.getData().text || '';
    }

    getDate()
    {
        return this.getData().date || null;
    }

    getHeaderColor()
    {
        return this.getData().headerColor || 'white';
    }

    getHeaderImage()
    {
        this.getData().headerImage = this.makeInstances(this.getData().headerImage, 'headerImage');
        return this.getData().headerImage;
    }

    getTag()
    {
        this.getData().tag = this.makeInstances(this.getData().tag, 'tag');
        return this.getData().tag;
    }

    getEmbed()
    {
        this.getData().embed = this.makeInstances(this.getData().embed, 'embed');
        return this.getData().embed;
    }

    getPublic()
    {
        return !!this.getData().public;
    }

    hasHeaderImage()
    {
        return _.isObjectNotEmpty(this.getHeaderImage());
    }
};

export default M;
