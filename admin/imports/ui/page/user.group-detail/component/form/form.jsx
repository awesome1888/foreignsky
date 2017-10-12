import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import UserGroupEntity from '../../../../../api/user.group/entity/entity.client.js';

export default class UserGroupForm extends EntityForm
{
    static getEntity()
    {
        return UserGroupEntity;
    }

    getItemTitle(item)
    {
        return item.getData().name || '';
    }
}
