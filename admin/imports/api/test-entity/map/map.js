import Map from '../../../lib/base/map/index.js';
import TestLinkedEntity from '../../test-linked-entity/entity/entity.server.js';

export default new class extends Map
{
    constructor()
    {
        super([
            {
                code: 'string',
                type: String,
                optional: false,
                label: 'Single string',
                // autoSelect: false,
            },
            {
                code: 'date',
                type: Date,
                optional: false,
                label: 'Single date',
            },
            {
                code: 'bool',
                type: Boolean,
                optional: false,
                defaultValue: false,
                label: 'Single boolean',
            },
            {
                code: 'num',
                type: Number,
                optional: false,
                defaultValue: 0,
                label: 'Single number',
            },


            {
                code: 'stringM',
                type: [String],
                optional: false,
                label: 'Multiple string',
            },
            {
                code: 'dateM',
                type: [Date],
                optional: false,
                label: 'Multiple date',
            },
            {
                code: 'boolM',
                type: [Boolean],
                optional: true,
                defaultValue: [false, true],
                label: 'Multiple boolean',
            },
            {
                code: 'numM',
                type: [Number],
                optional: false,
                defaultValue: [1, 2],
                label: 'Multiple number',
            },

            {
                code: 'map',
                type: new Map([
                    {
                        code: 'lat',
                        type: Number,
                    },
                    {
                        code: 'long',
                        type: Number,
                    }
                ]),
                optional: true,
                label: 'Sub-schema',
            },
            {
                code: 'mapM',
                type: [new Map([
                    {
                        code: 'lattt',
                        type: Number,
                    },
                    {
                        code: 'longgg',
                        type: Number,
                    }
                ])],
                optional: true,
                label: 'Sub-schema (array)',
            },

            {
                code: 'link',
                type: TestLinkedEntity,
                label: 'Sub-entity',
            },
            {
                code: 'linkM',
                type: [
                    TestLinkedEntity,
                ],
                label: 'Sub-entity (array)',
            },
        ]);
    }
}
