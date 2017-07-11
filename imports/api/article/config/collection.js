import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import BaseCollection from '../../../lib/util/base-collection/base-collection.js';
// import ArticleTagCollection from '/imports/api/collection/article/tag.js'
// import FileCollection from '/imports/api/collection/file.js'
// import EmbedCollection from '/imports/api/collection/embed.js'

class ArticleCollection extends BaseCollection
{
    constructor()
    {
        super('article-v2');
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
            // tag: {
            //     type: 'many',
            //     collection: ArticleTagCollection.instance,
            //     field: 'tagId',
            //     index: true,
            // },
            // headerImage: {
            //     type: 'one',
            //     collection: FileCollection.instance,
            //     field: 'headerImageId',
            //     index: false,
            // },
            // embed: {
            //     type: 'many',
            //     collection: EmbedCollection.instance,
            //     field: 'embedId',
            //     index: false,
            // },
        };
    }
}

export default new ArticleCollection();
