import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import AttributeGroup from '../../../../component/general/form/component/attribute-group/index.jsx';
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
        map.getAttribute('public').setParameter('show-label', false);
        map.insertAttributeAfter(new AttributeGroup({
            attributes: [
                {code: 'title', size: 10},
                {code: 'date', size: 6},
            ]
        }));
        
        return map;
    }
}
