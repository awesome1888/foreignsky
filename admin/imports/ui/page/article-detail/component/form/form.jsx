import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import Group from '../../../../component/general/form/component/group/index.jsx';
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
        // map.insertAttributeAfter('tag', 'title');

        map.insertAttributeAfter(new Group({
            fields: [
                {code: 'title', size: 10},
                {code: 'date', size: 6},
            ]
        }));

        console.dir(map);
        
        return map;
    }
}
