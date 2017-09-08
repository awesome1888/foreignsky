import Map from '../../../lib/base/map/index.js';
import Enum from '../../../lib/base/enum/index.js';

const M = (superclass) => class extends superclass
{
    constructor(definition)
    {
        super();

        const fileLinked = this.$('file');

        this.setDefinition(definition || [
            // {
            //     code: 'oneShit',
            //     type: String,
            //     allowedValues: new Enum([
            //         {value: 'Gallery', key: 'GALLERY'},
            //         {value: 'Image', key: 'IMAGE'},
            //     ]),
            //     optional: false,
            // },
            {
                code: 'anotherShit',
                type: [String],
                allowedValues: new Enum([
                    {value: 'Gallery Gallery Gallery Gallery Gallery Gallery Gallery Gallery Gallery Gallery Gallery Gallery Gallery Gallery Gallery Gallery Gallery Gallery Gallery Gallery', key: 'GALLERY'},
                    {value: 'Image', key: 'IMAGE'},
                    {value: 'Gallery1', key: 'GALLERY1'},
                    {value: 'Image1', key: 'IMAGE1'},
                    {value: 'Gallery2', key: 'GALLERY2'},
                    {value: 'Image2', key: 'IMAGE2'},
                    {value: 'Gallery3', key: 'GALLERY3'},
                    {value: 'Image3', key: 'IMAGE3'},
                ]),
                optional: false,
            },
            {
                code: 'item',
                type: [
                    new Map([
                        {
                            code: 'image',
                            type: fileLinked,
                        },
                        {
                            code: 'label',
                            type: String,
                            optional: true,
                        },
                        {
                            code: 'options',
                            type: [
                                new Map([
                                    {
                                        code: 'key',
                                        type: String,
                                    },
                                    {
                                        code: 'value',
                                        type: String, // todo: blackbox here!
                                    },
                                ])
                            ],
                            optional: true,
                        },
                    ])
                ],
                optional: false,
            },
            {
                code: 'renderer',
                type: String,
                // allowedValues: new Enum([
                //     {value: 'Gallery', key: 'GALLERY'},
                //     {value: 'Image', key: 'IMAGE'},
                // ]),
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
