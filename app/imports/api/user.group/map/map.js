const M = (superclass) => class extends superclass
{
    constructor(definition)
    {
        super(definition || [
            {
                code: 'code',
                type: String,
            },
            {
                code: 'name',
                type: String,
            },
        ]);
    }
};

export default M;
