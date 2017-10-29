import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import EmbedEntity from '../../../../../api/embed/entity/entity.client.js';

import RendererFileUploader from './component/file-uploader/index.jsx';
import RendererFileUploaderMP from './component/file-links/index.jsx';

export default class EmbedEntityForm extends EntityForm
{
    static getEntity()
    {
        return EmbedEntity;
    }

    getItemTitle(item)
    {
        return item.getData().string || '';
    }

    transformMap(map)
    {
        // attach file uploader to the image sub-attribute
        // map.getAttribute('item').getType()[0].getAttribute('image').setParameter('renderer', RendererFileUploader);

        map.getAttribute('files').setParameter('renderer', RendererFileUploaderMP);

        return map;
    }
}
