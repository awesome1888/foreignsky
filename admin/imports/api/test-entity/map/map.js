import Map from '../../../lib/base/map/index.js';
import Attribute from '../../../lib/base/map/attribute/index.js';

const M = (superclass) => class extends superclass
{
    constructor()
    {
        super();

        const testLinked = this.resolveEntityConstructor('test');

        this.setDefinition([
            {
                code: 'string',
                type: String,
                optional: false,
                label: 'Single string',
                // autoSelect: false,
            },
            // {
            //     code: 'date',
            //     type: Date,
            //     optional: true,
            //     label: 'Single date',
            // },
            // {
            //     code: 'bool',
            //     type: Boolean,
            //     optional: true,
            //     defaultValue: false,
            //     label: 'Single boolean',
            // },
            // {
            //     code: 'num',
            //     type: Number,
            //     optional: false,
            //     defaultValue: 10,
            //     label: 'Single number',
            // },
            //
            // {
            //     code: 'stringM',
            //     type: [String],
            //     optional: true,
            //     label: 'Multiple string',
            // },
            // {
            //     code: 'dateM',
            //     type: [Date],
            //     optional: true,
            //     label: 'Multiple date',
            // },
            // {
            //     code: 'boolM',
            //     type: [Boolean],
            //     optional: true,
            //     defaultValue: [false, true],
            //     label: 'Multiple boolean',
            // },
            // {
            //     code: 'numM',
            //     type: [Number],
            //     optional: true,
            //     defaultValue: [1, 2],
            //     label: 'Multiple number',
            // },
            //
            // {
            //     code: 'map',
            //     type: new Map([
            //         {
            //             code: 'lat',
            //             type: Number,
            //             optional: false,
            //         },
            //         {
            //             code: 'long',
            //             type: Number,
            //             optional: true,
            //         }
            //     ]),
            //     optional: true,
            //     label: 'Sub-schema',
            // },
            // {
            //     code: 'mapM',
            //     type: [new Map([
            //         {
            //             code: 'lattt',
            //             type: Number,
            //         },
            //         {
            //             code: 'longgg',
            //             type: Number,
            //         }
            //     ])],
            //     optional: true,
            //     label: 'Multiple Sub-schema',
            // },

            {
                code: 'link',
                type: testLinked,
                optional: true,
                label: 'Sub-entity',
            },
            {
                code: 'linkM',
                type: [
                    testLinked,
                ],
                optional: true,
                label: 'Sub-entity (array)',
            },
        ]);
    }
};

export default M;
