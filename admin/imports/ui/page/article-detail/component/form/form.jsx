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
        // map.removeAttribute('some attr');

        // do some tuning, like renderer

        return map;
    }
}
