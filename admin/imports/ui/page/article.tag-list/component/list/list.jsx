import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import ArticleTag from '../../../../../api/article.tag/entity/entity.client.js'

export default class ArticleTagList extends List
{
    static getEntity()
    {
        return ArticleTag;
    }

    getEntity()
    {
        return this.constructor.getEntity();
    }
}
