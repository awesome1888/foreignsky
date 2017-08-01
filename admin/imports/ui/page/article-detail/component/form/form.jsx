import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import Article from '../../../../../api/article/entity/entity.client.js'

export default class ArticleForm extends EntityForm
{
    getEntity()
    {
        return Article;
    }

    declareMap()
    {
    }
}
