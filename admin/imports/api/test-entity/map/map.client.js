import BaseMap from '../../../lib/base/map/index.js';
import MapBoth from './map.js';
import mix from '../../../lib/mixin.js';

import TestLinkedEntity from '../../../api/test-linked-entity/entity/entity.client.js';

class Map extends mix(BaseMap).with(MapBoth)
{
    getLinkedEntityMap()
    {
        return {
            test: TestLinkedEntity,
        };
    }
}

export default new Map();
