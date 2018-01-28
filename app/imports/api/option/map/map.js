import {SimpleSchema} from 'meteor/aldeed:simple-schema';

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
                code: 'public',
                type: Boolean,
                optional: true,
                defaultValue: false,
            },
            {
                code: 'userId',
                type: String,
                optional: true,
                defaultValue: null,
                regEx: SimpleSchema.RegEx.Id,
            },
            {
                code: 'appId',
                type: String,
                optional: true,
                defaultValue: null,
            },
        ]);
    }
};

export default M;
