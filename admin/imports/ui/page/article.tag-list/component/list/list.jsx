import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import ArticleTag from '../../../../../api/article.tag/entity/entity.client.js'

export default class ArticleTagList extends List
{
    getAllowedAttributes()
    {
        return [
            'title',
            'sort',
            'color',
            'primary',
        ];
    }

    getMap()
    {
        if (!this._cache.map)
        {
            const allowed = this.getAllowedAttributes();
            this._cache.map = super.getMap().filter((item) => {
                // optimize this
                return allowed.indexOf(item.code) >= 0;
            });
        }

        return this._cache.map;
    }

    getEntity()
    {
        return ArticleTag;
    }
}
