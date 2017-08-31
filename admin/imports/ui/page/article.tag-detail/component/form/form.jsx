import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import ArticleTagEntity from '../../../../../api/article.tag/entity/entity.client.js';

export default class ArticleTagEntityForm extends EntityForm
{
    static getEntity()
    {
        return ArticleTagEntity;
    }

    getItemTitle(item)
    {
        return item.getTitle();
    }
}
