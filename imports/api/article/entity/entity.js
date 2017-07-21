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

    get tagEntity()
    {
        throw new Error('Not implemented');
    }

    get tag()
    {
        const tags = this.data.tag;
        if (_.isArray(tags))
        {
            // todo: optimize this
            return tags.map((tag, k) => {
                if (this.isEntity(tag)) {
                    return tag;
                }
                if (_.isObjectNotEmpty(tag)) {
                    // make entity
                    const constr = this.constructor.resolveEntityConstructor('tag');
                    tags[k] = new constr(tag);

                    return tags[k];
                }

                return null;
            }).filter(item => item !== null);
        }

        return [];
    }

    hasHeaderImage()
    {
        return _.isObjectNotEmpty(this.data.headerImage);
    }
};

export default M;
