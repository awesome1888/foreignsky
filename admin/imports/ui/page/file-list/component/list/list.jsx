import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import File from '../../../../../api/file/entity/entity.client.js'

export default class extends List
{
    getEntity()
    {
        return File;
    }
}
