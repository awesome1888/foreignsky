import BaseEntity from '../../../lib/base/entity/entity.server.js';
import Exposition from '../exposition/exposition.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';

import Tag from '../../../api/article.tag/entity/entity.server.js'

export default class Article extends mix(BaseEntity).with(Entity)
{
    static restrictExpositionGrapher(filters, options, userId)
    {
        filters.public = true;
    }

    static get expositionController()
    {
        return Exposition;
    }

    /**
     * @access protected
     */
    static get tagConstructor()
    {
        return Tag;
    }
}
