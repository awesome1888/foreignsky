import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import Article from '../../../../../api/article/entity/entity.client.js'

export default class extends List
{
    getEntity()
    {
        return Article;
    }

    getAllowedAttributes()
    {
        return [
            'title',
            'date',
            'tags',
            'public',
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
}
