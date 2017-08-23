import BaseEntity from '../../../lib/base/entity/entity.server.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import Util from '../../../lib/util.js';
import map from '../map/map.server.js';

export default class File extends mix(BaseEntity).with(Entity)
{
    static getMapInstance()
    {
        return map;
    }

    static getLocalFolderAbsolute()
    {
        return Util.getAssetFolder()+this.getLocalFolder();
    }

    static getLocalFolder()
    {
        return 'img/';
    }

    static create(path, name = 'File')
    {
        return this.getCollection().insert({
            path: this.getLocalFolder()+path,
            name,
        });
    }
}
