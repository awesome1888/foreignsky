import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import UserGroup from '../../../../../api/user.group/entity/entity.client.js'

export default class extends List
{
    static getEntity()
    {
        return UserGroup;
    }

    getEntity()
    {
        return this.constructor.getEntity();
    }
}
