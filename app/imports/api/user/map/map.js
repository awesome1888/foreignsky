import Map from '../../../lib/base/map/index.js';

const M = (superclass) => class extends superclass
{
    constructor(definition)
    {
        super();

        const Group = this.$('group');

        this.setDefinition(definition || [
            {
                code: 'emails',
                type: [
                    new Map([
                        {
                            code: 'address',
                            type: String,
                        },
                        {
                            code: 'verified',
                            type: Boolean,
                            optional: true,
                        }
                    ])
                ],
                // had to set it optional in order to make google oauth work. unfortunately, simple schema
                // validator is executed before hook:before.insert :(
                // which is obviously wrong, but nothing to do with this
                // todo: when we remove simple schema attachment, this problem will go away and we will be
                // todo: able to switch back to false here
                optional: true,
            },
            {
                // this is for storing password and other stuff
                code: 'services',
                type: Object,
                blackbox: true,
            },
            {
                code: 'createdAt',
                type: Date,
            },
            // caution! the "profile" object will be AUTOMATICALLY brought to the client side
            // and will be visible to everybody, so DO NOT place here any secret information
            {
                code: 'profile',
                type: new Map([
                    {
                        code: 'fullName',
                        type: String,
                        optional: true,
                        autoSelect: false,
                    },
                    {
                        code: 'firstName',
                        type: String,
                        optional: true,
                    },
                    {
                        code: 'lastName',
                        type: String,
                        optional: true,
                    },
                    {
                        code: 'group',
                        type: [Group],
                        optional: true,
                    },
                ]),
            },
        ]);
    }
};

export default M;
