import BaseEntity from '../../../lib/util/base-entity/base-entity.client.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';

export default class Tag extends mix(BaseEntity).with(Entity)
{
}