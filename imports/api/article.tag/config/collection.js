import Collection from '../../../lib/base/collection/collection.js';

export default new class extends Collection
{
    constructor()
    {
        super('article.tag');
    }

    get schema()
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
