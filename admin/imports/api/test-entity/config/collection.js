import Collection from '../../../lib/base/collection/collection.js';
import ArticleTagCollection from '../../article.tag/config/collection.js';
import FileCollection from '../../file/config/collection.js';
import EmbedCollection from '../../embed/config/collection.js';

export default new class extends Collection
{
    constructor()
    {
        super('test-entity');
    }

    getSchema()
    {
        return {
            string: {
                type: String,
                optional: false,
                label: 'Single string',
            },
            date: {
                type: Date,
                optional: false,
                label: 'Single date',
            },
            bool: {
                type: Boolean,
                optional: false,
                defaultValue: false,
                label: 'Single boolean',
            },
            num: {
                type: Number,
                optional: false,
                defaultValue: 0,
                label: 'Single number',
            },



            stringM: {
                type: [String],
                optional: false,
                label: 'Multiple string',
            },
            // dateM: {
            //     type: [Date],
            //     optional: false,
            //     label: 'Multiple date',
            // },
            // boolM: {
            //     type: [Boolean],
            //     optional: true,
            //     defaultValue: [false, true],
            //     label: 'Multiple boolean',
            // },
            // numM: {
            //     type: [Number],
            //     optional: false,
            //     defaultValue: [1, 2],
            //     label: 'Multiple number',
            // },



            // schema: {
            //     type: new SimpleSchema({
            //         lat: {
            //             type: Number,
            //         },
            //         long: {
            //             type: Number,
            //         }
            //     }),
            //     optional: true,
            //     label: 'Sub-schema',
            // },
            // schemaM: {
            //     type: [new SimpleSchema({
            //         lat: {
            //             type: Number,
            //         },
            //         long: {
            //             type: Number,
            //         }
            //     })],
            //     optional: true,
            //     label: 'Sub-schema (array)',
            // },




            // ref: {
            //     type: String,
            //     optional: false,
            //     label: 'Single ref',
            // },
            // refM: {
            //     type: [String],
            //     optional: false,
            //     label: 'Single ref',
            // },

        };
    }

    // getLinks()
    // {
    //     return {
    //         link: {
    //             type: 'one',
    //             collection: ArticleTagCollection,
    //             field: 'ref',
    //             index: false,
    //         },
    //         linkM: {
    //             type: 'many',
    //             collection: ArticleTagCollection,
    //             field: 'refM',
    //             index: true,
    //         },
    //     };
    // }
}
