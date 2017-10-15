import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class User extends superclass
{
    static getCollectionInstance()
    {
        return Collection;
    }

    static getUniqueCode()
    {
        return 'user';
    }

    static getId()
    {
        return Meteor.userId();
    }

    static isAuthorized()
    {
        return !!this.getId();
    }
};

export default M;
