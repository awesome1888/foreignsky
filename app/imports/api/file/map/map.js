const M = (superclass) => class extends superclass
{
    constructor(definition)
    {
        super(definition || [
            {
                code: 'name',
                type: String,
                optional: false,
            },
            {
                code: 'url',
                type: String,
                optional: false,
            },
            {
                code: 'type',
                type: String,
                optional: true,
            },
            {
                code: 'size',
                type: Number,
                optional: true,
            },
        ]);
    }
};

export default M;
