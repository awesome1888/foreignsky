const M = (superclass) => class extends superclass
{
    constructor(definition)
    {
        super(definition || [
            {
                code: 'title',
                type: String,
                optional: false,
            },
            {
                code: 'sort',
                type: Number,
                optional: true,
            },
            {
                code: 'color',
                type: String,
                regEx: /^[a-z0-9_-]+$/,
                optional: true,
            },
            {
                code: 'primary',
                type: Boolean,
                optional: true,
            },
            {
                code: 'search',
                type: String,
                optional: true,
                autoSelect: false,
            },
        ]);
    }
};

export default M;
