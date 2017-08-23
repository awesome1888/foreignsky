const M = (superclass) => class Map extends superclass
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
