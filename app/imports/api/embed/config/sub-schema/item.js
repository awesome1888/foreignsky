import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import OptionSchema from './../../../../lib/util/schema/option.js';

export default new SimpleSchema({
    imageId: {
        type: String,
        optional: false,
    },
    label: {
        type: String,
        optional: true,
    },
    options: {
        type: [OptionSchema],
        optional: true,
    },
});
