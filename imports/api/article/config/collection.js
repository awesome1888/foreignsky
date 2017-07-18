import BaseCollection from '../../../lib/util/base-collection/base-collection.js';
import ArticleTagCollection from '../../article.tag/config/collection.js';
import FileCollection from '../../file/config/collection.js';
import EmbedCollection from '../../embed/config/collection.js';

class ArticleCollection extends BaseCollection
{
    constructor()
    {
        super('article');
    }

    get schema()
    {
        return {
            title: {
                type: String,
                optional: false,
            },
            date: {
                type: Date,
                optional: false,
            },
            text: {
                type: String,
                optional: false,
            },
            tagId: {
                type: [String],
                optional: true,
            },
            location: {
                type: [Number],
                optional: true,
            },
            headerImageId: {
                type: [String],
                optional: true,
            },
            headerColor: {
                type: String,
                optional: true,
                regEx: /^[a-z0-9_-]+$/,
            },
            search: {
                type: String,
                optional: false,
            },
            embedId: {
                type: [String],
                optional: true,
            },
            public: {
                type: Boolean,
                optional: true,
                defaultValue: false,
            }
        };
    }

    get links()
    {
        return {
            tag: {
                type: 'many',
                collection: ArticleTagCollection,
                field: 'tagId',
                index: true,
            },
            headerImage: {
                type: 'one',
                collection: FileCollection,
                field: 'headerImageId',
                index: false,
            },
            embed: {
                type: 'many',
                collection: EmbedCollection,
                field: 'embedId',
                index: false,
            },
        };
    }

    get indexes() {
        return [
            {
                fields: {
                    search: "text",
                },
                options: {
                    name: 'search',
                },
            }
        ];
    }
}

export default new ArticleCollection();
