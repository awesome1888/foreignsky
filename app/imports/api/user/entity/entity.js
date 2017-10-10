/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class User extends superclass
{
    static getCollectionInstance()
    {
        return Meteor.users;
    }
};

export default M;
