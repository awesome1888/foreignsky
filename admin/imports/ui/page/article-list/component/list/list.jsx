import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import Article from '../../../../../api/article/entity/entity.client.js'

export default class extends List
{
    getEntity()
    {
        return Article;
    }

    getMap()
    {
        const map = super.getMap();

        console.dir(map);

        return map;
    }
}
