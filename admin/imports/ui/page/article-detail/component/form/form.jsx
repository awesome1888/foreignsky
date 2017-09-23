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
        map.insertAttributeAfter(new AttributeGroup({
            attributes: [
                {code: 'title', size: 'eleven'},
                {code: 'date', size: 'five'},
            ]
        }));

        map.insertAttributeAfter('headerImage');
        map.insertAttributeAfter('location', 'embed');

        map.getAttribute('public').setParameter('show-label', false);
        map.getAttribute('headerImage').setParameter('show-label', false);

        return map;
    }
}
