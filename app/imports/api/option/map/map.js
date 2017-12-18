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
                type: String,
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
                code: 'isPrivate',
                type: Boolean,
                optional: true,
                defaultValue: true,
            },
        ]);
    }
};

export default M;
