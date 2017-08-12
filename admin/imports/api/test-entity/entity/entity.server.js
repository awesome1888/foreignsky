import BaseEntity from '../../../lib/base/entity/entity.server.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import map from '../map/map.server.js';

export default class Test extends mix(BaseEntity).with(Entity)
{
    static getMapInstance()
    {
        return map;
    }
}
