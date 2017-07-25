import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import Embed from '../../../../../api/embed/entity/entity.client.js'

export default class extends List
{
    getEntity()
    {
        return Embed;
    }
}
