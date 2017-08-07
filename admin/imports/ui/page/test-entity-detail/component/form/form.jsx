import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import TestEntity from '../../../../../api/test-entity/entity/entity.client.js';

export default class TestEntityForm extends EntityForm
{
    getEntity()
    {
        return TestEntity;
    }

    setTitleAfterDataLoad(item)
    {
        this.setTitle(item.getTitle());
    }
}
