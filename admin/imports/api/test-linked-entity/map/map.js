const M = (superclass) =>  class Map extends superclass
{
    constructor()
    {
        super([
            {
                code: 'string',
                type: String,
                optional: false,
                label: 'Field 1',
            },
            {
                code: 'date',
                type: Date,
                optional: false,
                label: 'Field 2',
            },
            {
                code: 'bool',
                type: Boolean,
                optional: false,
                defaultValue: false,
                label: 'Field 3',
            },
        ]);
    }
};

export default M;
