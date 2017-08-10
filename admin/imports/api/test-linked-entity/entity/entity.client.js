import BaseEntity from '../../../lib/base/entity/entity.client.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';

export default class TestSub extends mix(BaseEntity).with(Entity)
{
    static getTitle()
    {
        return 'Test Sub-Entity';
    }
}
