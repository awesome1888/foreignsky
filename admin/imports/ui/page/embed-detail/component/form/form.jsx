import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import EmbedEntity from '../../../../../api/embed/entity/entity.client.js';

export default class EmbedEntityForm extends EntityForm
{
    static getEntity()
    {
        return EmbedEntity;
    }

    getItemTitle(item)
    {
        return item.getData().string || '';
    }
}
