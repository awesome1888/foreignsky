import BaseEntity from '../../../lib/base/entity/entity.server.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import map from '../map/map.server.js';
import File from '../../../api/file/entity/entity.server.js';

export default class Article extends mix(BaseEntity).with(Entity)
{
    static getMapInstance()
    {
        return map;
    }

    static onBeforeSave(id, data)
    {
        // if text gets updated, update the search field too
        if (!('search' in data) && _.isStringNotEmpty(data.text))
        {
            data.search = data.text.toUpperCase();
        }
    }
}
