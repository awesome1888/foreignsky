export default class Publication
{
    /**
     * This publication allows to bring some data to the client in addition of what
     * is provided by the standard mechanism. This data will be also accessible
     * via Meteor.user()
     */
    static makeSupplementaryPublication()
    {
        // todo: currently not working
        Meteor.publish('user-supplementary', function () {
            return Meteor.users.find({_id: this.userId}, {
                fields: {
                    profile: 1,
                    createdAt: 1,
                    groupId: 1,
                    tmpField: 1,
                },
                limit: 1
            });
            //
            // this.ready();
            // return cursor;
        });
    }

    static denyAll()
    {
        Meteor.users.deny({
            update() { return true; }
        });
    }

    static declare(sp = null)
    {
        this.denyAll(); // unconditional deny
        this.makeSupplementaryPublication();
    }
}
