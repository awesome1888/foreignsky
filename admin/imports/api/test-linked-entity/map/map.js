const M = (superclass) => class Map extends superclass
{
    constructor(definition)
    {
        super(definition || [
            {
                code: 'string',
                type: String,
                optional: false,
                label: 'Field 1',
            },
            {
                code: 'date',
                type: String,
                optional: false,
                label: 'Field 2',
                defaultValue: 'test',
                autoSelect: false,
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
