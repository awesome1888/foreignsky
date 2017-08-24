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
                code: 'path',
                type: String,
                optional: false,
            },
        ]);
    }
};

export default M;
