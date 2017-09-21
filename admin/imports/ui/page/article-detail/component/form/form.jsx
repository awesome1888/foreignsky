import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import Article from '../../../../../api/article/entity/entity.client.js';

export default class ArticleForm extends EntityForm
{
    static getEntity()
    {
        return Article;
    }

    getItemTitle(item)
    {
        return item.getTitle();
    }

    transformMap(map)
    {
        // display title and date in the one row
        // map.group([
        //     'title',
        //     'date',
        // ]);

        return map;
    }
}
