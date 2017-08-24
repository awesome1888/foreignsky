import BaseEntity from '../../../lib/base/entity/entity.server.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import map from '../map/map.client.js';

export default class Tag extends mix(BaseEntity).with(Entity)
{
    static getMapInstance()
    {
        return map;
    }
}
