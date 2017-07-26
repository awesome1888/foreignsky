import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import Article from '../../../../../api/article/entity/entity.client.js'

export default class extends List
{
    getEntity()
    {
        return Article;
    }

    getAllowedAttributes()
    {
        return ;
    }

    getMap()
    {
        return this.makeMapCache([
            'title',
            'date',
            'tags',
            'public',
        ]);
    }
}
