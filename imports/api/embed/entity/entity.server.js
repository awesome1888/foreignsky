import BaseEntity from '../../../lib/util/base-entity/base-entity.server.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';

export default class Embed extends mix(BaseEntity).with(Entity)
{
}
