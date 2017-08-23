import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import EmbedEntity from '../../../../../api/embed/entity/entity.client.js'

export default class extends List
{
    getEntity()
    {
        return EmbedEntity;
    }
}
