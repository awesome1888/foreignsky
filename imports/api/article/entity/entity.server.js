import BaseEntity from '../../../lib/base/entity/entity.server.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';

import Tag from '../../../api/article.tag/entity/entity.server.js'

export default class Article extends mix(BaseEntity).with(Entity)
{
    static restrictExposition(filters, options, userId)
    {
        filters.public = true;
    }

    /**
     * @access protected
     */
    static get tagConstructor()
    {
        return Tag;
    }
}
