import Collection from '../../../lib/base/collection/collection.js';

export default new class extends Collection
{
    constructor()
    {
        super(Meteor.users);
    }

    applyHooks()
    {
        this.getCollection().before.insert(this.__onBeforeInsert.bind(this));
    }

    __onBeforeInsert(id, data)
    {
        // special hook for google oauth
        const google = _.getValue(data, 'services.google');
        if (_.isObjectNotEmpty(google))
        {
            const email = google.email;

            // check the email against the whitelist
            // todo: hardcoded for now...
            if (email !== 'awesome1888@gmail.com')
            {
                throw new Meteor.Error(401, 'Not authorized');
            }

            if (!_.isArrayNotEmpty(data.emails))
            {
                data.emails = [
                    {
                        address: email,
                        verified: google.verified_email,
                    }
                ];
            }

            if (!_.isObject(data.profile))
            {
                data.profile = {};
            }

            if (!_.isStringNotEmpty(data.profile.firstName))
            {
                data.profile.firstName = google.given_name;
            }

            if (!_.isStringNotEmpty(data.profile.lastName))
            {
                data.profile.lastName = google.family_name;
            }

            data.profile.fullName = `${data.profile.firstName} ${data.profile.lastName}`;
        }
    }
}
