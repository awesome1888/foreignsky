import BaseEntity from '../../../lib/base/entity/entity.server.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import Util from '../../../lib/util.js';

export default class File extends mix(BaseEntity).with(Entity)
{
    static get localFolderAbsolute()
    {
        return Util.getAssetsFolder()+this.localFolder;
    }

    static get localFolder()
    {
        return 'img/';
    }

    static create(path, name = 'File')
    {
        return this.collection.insert({
            path: this.localFolder+path,
            name,
        });
    }
}