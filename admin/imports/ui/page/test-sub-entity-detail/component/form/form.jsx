import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import TestSubEntity from '../../../../../api/test-linked-entity/entity/entity.client.js';

export default class TestEntityForm extends EntityForm
{
    getEntity()
    {
        return TestSubEntity;
    }

    getItemTitle(item)
    {
        return item.getData().string || '';
    }
}
