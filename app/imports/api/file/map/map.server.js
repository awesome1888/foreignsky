import BaseMap from '../../../lib/base/map/index.js';
import MapBoth from './map.js';
import mix from '../../../lib/mixin.js';

class Map extends mix(BaseMap).with(MapBoth)
{
}

export default new Map();
