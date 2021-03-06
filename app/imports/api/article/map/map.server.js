import BaseMap from '../../../lib/base/map/index.js';
import MapBoth from './map.js';
import mix from '../../../lib/mixin.js';

import ArticleTagEntity from '../../article.tag/entity/entity.server.js';
import FileEntity from '../../file/entity/entity.server.js';
import EmbedEntity from '../../embed/entity/entity.server.js';

class Map extends mix(BaseMap).with(MapBoth)
{
    getLinkedEntityMap()
    {
        return {
            embed: EmbedEntity,
            tag: ArticleTagEntity,
            headerImage: FileEntity,
        };
    }
}

export default new Map();
