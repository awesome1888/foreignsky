const M = (superclass) => class extends superclass
{
    constructor(definition)
    {
        super(definition || [
            {
                code: 'name',
                type: String,
            },
            {
                code: 'code',
                type: String,
            },
        ]);
    }
};

export default M;
