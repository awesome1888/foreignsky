import BaseEntity from '../../../lib/base/entity/entity.client.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import Tag from '../../../api/article.tag/entity/entity.client.js';

export default class Article extends mix(BaseEntity).with(Entity)
{
    static getTitle()
    {
        return 'Test Entity';
    }

    static getEntityMap()
    {
        return {
            tag: Tag,
        };
    }
}
