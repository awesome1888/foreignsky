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
            {
                code: 'group',
                type: [Group],
            },
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
                ]),
            },
        ]);
    }
};

export default M;
