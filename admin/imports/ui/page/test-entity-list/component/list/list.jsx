import React from 'react';
import List from '../../../../component/general/list/list.jsx';
import TestEntity from '../../../../../api/test-entity/entity/entity.client.js'

export default class TestEntityList extends List
{
    getEntity()
    {
        return TestEntity;
    }

    declareMap()
    {
        return this.readMap({
            'title': 1,
        });
    }
}
