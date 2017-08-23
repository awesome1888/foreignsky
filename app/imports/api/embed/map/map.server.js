import BaseMap from '../../../lib/base/map/index.js';
import MapBoth from './map.js';
import mix from '../../../lib/mixin.js';

import FileEntity from '../../file/entity/entity.server.js';

class Map extends mix(BaseMap).with(MapBoth)
{
    getLinkedEntityMap()
    {
        return {
            file: FileEntity,
        };
    }
}

export default new Map();
