import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export default new SimpleSchema({
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        optional: false,
        label: 'E-Mail-Adresse',
    },
    password: {
        type: String,
        optional: false,
        label: 'Passwort',
    },
});
