import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import Article from '../../../../../api/article/entity/entity.client.js'

import TagRenderer from './component/renderer/tag/tag.jsx';

export default class ArticleList extends List
{
    getEntity()
    {
        return Article;
    }

    transformMap(map)
    {
        map.leaveOnly(['title', 'date', 'public']);

        return map;
    }
}
