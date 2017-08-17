import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import TestSubEntity from '../../../../../api/test-linked-entity/entity/entity.client.js'

export default class TestEntityList extends List
{
    getEntity()
    {
        return TestSubEntity;
    }
}
