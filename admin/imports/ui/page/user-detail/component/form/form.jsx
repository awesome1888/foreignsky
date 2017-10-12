import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import UserEntity from '../../../../../api/user/entity/entity.client.js';

export default class UserForm extends EntityForm
{
    static getEntity()
    {
        return UserEntity;
    }

    getItemTitle(item)
    {
        return item.getData().name || '';
    }
}
