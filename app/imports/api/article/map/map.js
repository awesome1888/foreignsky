import Map from '../../../lib/base/map/index.js';

const M = (superclass) => class extends superclass
{
    constructor(definition)
    {
        super();

        const embed = this.$('embed');
        const tag = this.$('tag');
        const headerImage = this.$('headerImage');

        this.setDefinition(definition || [
            {
                code: 'title',
                type: String,
                optional: false,
            },
            {
                code: 'date',
                type: Date,
                optional: false,
                defaultValue: new Date(),
            },
            {
                code: 'text',
                type: String,
                optional: false,
            },
            {
                code: 'location',
                type: new Map([
                    {
                        code: 'latitude',
                        type: Number,
                        decimal: true,
                    },
                    {
                        code: 'longitude',
                        type: Number,
                        decimal: true,
                    }
                ]),
                optional: true,
            },
            {
                code: 'search',
                type: String,
                optional: false,
                autoSelect: false,
            },
            {
                code: 'public',
                type: Boolean,
                optional: true,
                defaultValue: false,
            },
            {
                code: 'tag',
                type: [tag],
                optional: true,
            },
            {
                code: 'headerImage',
                type: headerImage,
                optional: true,
            },
            {
                code: 'embed',
                type: [embed],
                optional: true,
            },
        ]);
    }
};

export default M;
