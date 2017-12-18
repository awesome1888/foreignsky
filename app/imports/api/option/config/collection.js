import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import Collection from '../../../lib/base/collection/collection.js';
// import Users from '../../../api/user/config/collection.js';

export default new class extends Collection
{
    constructor()
    {
        super('option');
    }

    getSchema()
    {
        return {
            name: {
                type: String,
                optional: false,
                label: 'Name',
            },
            value: {
                type: Object,
                blackbox: true,
                optional: false,
                label: 'Value',
            },
            // future-reserved
            userId: {
                type: String,
                regEx: SimpleSchema.RegEx.Id,
                optional: true,
            },
            // to expose only "non-private" client-side
            isPrivate: {
                type: Boolean,
                optional: true,
                defaultValue: true,
            },
        };
    }

    getLinks()
    {
        return {
            // candidate: {
            //     type: 'one',
            //     collection: Users,
            //     field: 'userId',
            // },
        };
    }
}
