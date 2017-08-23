import Map from '../../../lib/base/map/index.js';

const M = (superclass) => class extends superclass
{
    constructor(definition)
    {
        super();

        const fileLinked = this.$('file');

        this.setDefinition(definition || [
            {
                code: 'item',
                type: [
                    new Map([
                        {
                            code: 'imageId',
                            type: fileLinked,
                        },
                        {
                            code: 'label',
                            type: String,
                            optional: true,
                        },
                        {
                            code: 'options',
                            type: [new Map([
                                {
                                    code: 'key',
                                    type: String,
                                },
                                {
                                    code: 'value',
                                    type: String, // todo: blackbox here!
                                },
                            ])],
                            optional: true,
                        },
                    ])
                ],
                optional: false,
            },
            {
                code: 'renderer',
                type: String,
                optional: false,
            },
            {
                code: 'options',
                type: [new Map([
                    {
                        code: 'key',
                        type: String,
                    },
                    {
                        code: 'value',
                        type: String, // todo: blackbox here!
                    },
                ])],
                optional: true,
            },
        ]);
    }
};

export default M;
