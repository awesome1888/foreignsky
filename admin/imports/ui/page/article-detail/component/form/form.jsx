import React from 'react';
import Form from '../../../../component/general/form/form.jsx';
import Article from '../../../../../api/article/entity/entity.client.js'

export default class ArticleForm extends Form
{
    getEntity()
    {
        return Article;
    }

    declareMap()
    {

    }
}