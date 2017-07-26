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

    declareMap()
    {
        return this.readMap({
            'title': 1,
            'date': 1,
            'tag': {
                renderer: TagRenderer,
            },
            'public': 1,
        });
    }
}
