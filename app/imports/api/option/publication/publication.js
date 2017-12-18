export default class Publication
{
    static makePublication(userId)
    {
        // todo: currently not working
        Meteor.publish('option.main', function () {
            const cursor = Meteor.users.find({_id: userId}, {
                fields: {
                    profile: 1,
                    createdAt: 1,
                    groupId: 1,
                    tmpField: 1,
                },
                limit: 1
            });
            this.ready();
            return cursor;
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
        this.makePublication();
    }
}
