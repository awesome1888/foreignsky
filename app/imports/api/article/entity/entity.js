import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class Article extends superclass
{
    static getCollection()
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
        return this.getData().headerImage || {};
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
        return _.isObjectNotEmpty(this.headerImage);
    }

    static getFullSelect()
    {
        // todo: hard-coded for now, but need to be auto-generated based on schema,
        // todo: auto-select field and links!
        return {
            title: 1,
            public: 1,
            date: 1,
            text: 1,
            location: 1,
            tag: {
                title: 1,
                sort: 1,
                color: 1,
                primary: 1,
            },
            headerImage: {
                name: 1,
                path: 1,
            },
            embed: {
                item: {
                    imageId: 1,
                    label: 1,
                    options: {
                        key: 1,
                        value: 1,
                    },
                },
                renderer: 1,
                options: {
                    key: 1,
                    value: 1,
                },
            },
        };
    }
};

export default M;
