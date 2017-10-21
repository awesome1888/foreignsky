import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) => class User extends superclass
{
    static _user = null;

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

    static get()
    {
        if (!this.isReady())
        {
            return null;
        }

        return new this(Meteor.user() || {});
    }

    static isReady()
    {
        return _.isObjectNotEmpty(Meteor.user());
    }

    getProfile()
    {
        return this.getData().profile || {};
    }

    getFullName()
    {
        const p = this.getProfile();
        return `${p.firstName} ${p.lastName}`;
    }

    getGroupIds()
    {
        return this.getProfile().groupId || [];
    }
};

export default M;
