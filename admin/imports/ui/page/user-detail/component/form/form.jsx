import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import UserEntity from '../../../../../api/user/entity/entity.client.js';

import Map from '../../../../../lib/base/map/index.js';
import Attribute from '../../../../../lib/base/map/attribute/index.js';

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

    transformMap(map)
    {
        map.removeAttribute('createdAt');
        map.insertAttributeAfter('emails', 'profile');

        map.getAttribute('emails').getType()[0].getAttribute('verified').setParameter('show-label', false);

        map.insertAttributeAfter(new Attribute({
            code: 'updatePassword',
            type: new Map([
                {
                    code: 'newPassword',
                    type: String,
                    optional: true,
                },
                {
                    code: 'newPasswordRepeat',
                    type: String,
                    custom()
                    {
                        const pass = this.field('newPassword').value;
                        const passRepeat = this.field('newPasswordRepeat').value;
                        if (pass !== passRepeat) {
                            return 'passwordsDoNotMatch';
                        }
                        return null;
                    },
                    optional: true,
                },
            ]),
        }), 'profile');

        return map;
    }
}
