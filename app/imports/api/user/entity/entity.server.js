import BaseEntity from '../../../lib/base/entity/entity.server.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import map from '../map/map.server.js';

import {Accounts} from 'meteor/accounts-base';

export default class User extends mix(BaseEntity).with(Entity)
{
    static getMapInstance()
    {
        return map;
    }

    static save(id, data)
    {
        if (!_.isObject(data))
        {
            return false;
        }

        const collection = this.getCollection();
        if (this.onBeforeSave(id, data) === false)
        {
            return false;
        }
        if (!_.isStringNotEmpty(id))
        {
            if (!_.isStringNotEmpty(data.email) || !_.isStringNotEmpty(data.password))
            {
                // todo: improve this, make it transparent
                throw new TypeError('When creating a new user, you must provide email and password');
            }

            id = Accounts.createUser({
                email: data.email,
                password: data.password,
                profile: data.profile || {},
            });
        }

        // just to be 100% sure...
        const updateData = _.clone(data);
        delete updateData.email;
        delete updateData.password;

        if(collection.update({
            _id: id,
        }, {
            $set: this.flatten(updateData),
        }))
        {
            this.onAfterSave(id, data);
            return id;
        }
    }
}
