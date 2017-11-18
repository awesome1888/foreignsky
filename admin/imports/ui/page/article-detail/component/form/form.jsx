import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import AttributeGroup from '../../../../component/general/form/component/attribute-group/index.jsx';
import Article from '../../../../../api/article/entity/entity.client.js';

import RichRenderer from '../../../../component/general/form/component/renderer/rich/index.jsx';
import TagSelectorRenderer from './component/tag-selector/index.jsx';
import EmbedSelectorRenderer from './component/embed-selector/index.jsx';
import PublicRenderer from './component/public/index.jsx';
import GoogleMapRenderer from '../../../../component/general/form/component/renderer/google-map/index.jsx';

export default class ArticleForm extends EntityForm
{
    _token = '';

    static getEntity()
    {
        return Article;
    }

    async getModel()
    {
        await this.loadToken();
        await super.getModel();
    }

    async loadToken()
    {
        this._token = await this.execute('article.draftToken.get');
    }

    getToken()
    {
        return this._token;
    }

    extractItemTitle(item)
    {
        return item.getTitle();
    }

    transformMap(map)
    {
        // group title and date together
        map.insertAttributeAfter(new AttributeGroup({
            code: 'title-date',
            attributes: [
                {code: 'title', size: 'eleven'},
                {code: 'date', size: 'five'},
            ]
        }));

        map.insertAttributeAfter('tag', 'title-date'); // tags go after title-date group
        map.insertAttributeAfter('headerImage'); // header image on top
        map.insertAttributeAfter('public'); // public on top of header image
        map.insertAttributeAfter('location', 'embed'); // embed to the end

        map.getAttribute('public').setParameter('show-label', false);
        map.getAttribute('headerImage').setParameter('show-label', false);

        // assign specific renderers
        map.getAttribute('text').setParameter('renderer', RichRenderer);
        map.getAttribute('tag').setParameter('renderer', TagSelectorRenderer);
        map.getAttribute('embed').setParameter('renderer', EmbedSelectorRenderer);
        map.getAttribute('location').setParameter('renderer', GoogleMapRenderer);
        map.getAttribute('public').setParameter('renderer', PublicRenderer);

        return map;
    }
}
