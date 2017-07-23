import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export default new SimpleSchema({
    key: {
        type: String,
    },
    value: {
        type: String,
    }
});
