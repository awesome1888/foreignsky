import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import EmbedEntity from '../../../../../api/embed/entity/entity.client.js'

export default class extends List
{
    static getEntity()
    {
        return EmbedEntity;
    }

    getEntity()
    {
        return this.constructor.getEntity();
    }
}
