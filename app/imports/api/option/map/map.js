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
                code: 'value',
                type: Object,
                optional: false,
                blackbox: true,
            },
            {
                code: 'userId',
                type: String,
                optional: true,
                regEx: SimpleSchema.RegEx.Id,
            },
            {
                code: 'public',
                type: Boolean,
                optional: true,
                defaultValue: false,
            },
        ]);
    }
};

export default M;
