import BaseCollection from '../../../lib/util/base-collection/base-collection.js';

export default class ArticleTagCollection extends BaseCollection
{
    constructor()
    {
        super('article.tag-v2');
    }

    schema()
    {
        return {
            title: {
                type: String,
                optional: false,
            },
            sort: {
                type: Number,
                optional: true,
            },
            color: {
                type: String,
                optional: true,
                regEx: /^[a-z0-9_-]+$/,
            },
            primary: {
                type: Boolean,
                optional: true,
            },
            search: {
                type: String,
                optional: true,
            },
        };
    }
}
