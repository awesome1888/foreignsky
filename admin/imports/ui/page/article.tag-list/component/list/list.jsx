import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import ArticleTag from '../../../../../api/article.tag/entity/entity.client.js'

export default class ArticleTagList extends List
{
    declareMap()
    {
        return this.readMap({
            'title': 1,
            'sort': 1,
            'color': 1,
            'primary': 1,
        });
    }

    getEntity()
    {
        return ArticleTag;
    }
}
