import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import User from '../../../../../api/user/entity/entity.client.js'

export default class extends List
{
    static getEntity()
    {
        return User;
    }

    getEntity()
    {
        return this.constructor.getEntity();
    }
}
