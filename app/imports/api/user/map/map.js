import Map from '../../../lib/base/map/index.js';

const M = (superclass) => class extends superclass
{
    constructor(definition)
    {
        super(definition || [
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
                code: 'createdAt',
                type: Date,
            },
            {
                code: 'groupId',
                type: [String],
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
