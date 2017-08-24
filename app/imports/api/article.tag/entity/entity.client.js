import BaseEntity from '../../../lib/base/entity/entity.client.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import map from '../map/map.client.js';

export default class Tag extends mix(BaseEntity).with(Entity)
{
    static getTitle()
    {
        return 'Article tag';
    }

    static getMapInstance()
    {
        return map;
    }
}
