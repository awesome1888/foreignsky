import UserGroup from '../../../../api/user.group/entity/entity.client.js';
import User from '../../../../api/user/entity/entity.client.js';

export default class Accounts
{
    static getSubscription()
    {
        return Meteor.subscribe('user-supplementary');
    }

    static isUserAuthorized()
    {
        return User.isAuthorized();
    }

    _waitAccounts = null;
    _waitGroupData = null;
    _accountsReadyCallback = null;
    _application = null;

    constructor(app)
    {
        this._application = app;
    }

    getApp()
    {
        return this._application;
    }

    waitData()
    {
        if (!this.getApp().userDataReady())
        {
            // wait for user data to be loaded, reactively
            this.waitAccounts();
        }

        // wait for group data to be loaded
        this.waitGroupData();

        return Promise.all([this._waitAccounts, this._waitGroupData]);
    }

    waitAccounts()
    {
        if (this._waitAccounts === null)
        {
            this._waitAccounts = new Promise((resolve) => {
                this._accountsReadyCallback = resolve;
            });
        }

        return this._waitAccounts;
    }

    waitGroupData()
    {
        if (this._waitGroupData === null)
        {
            this._waitGroupData = UserGroup.loadData();
        }

        return this._waitGroupData;
    }

    informAccountsReady()
    {
        if (this._accountsReadyCallback)
        {
            this._accountsReadyCallback();
        }
    }
}
