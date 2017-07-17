import BaseEntity from '../../../lib/util/base-entity/base-entity.server.js';
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

    static convertToUrl(path)
    {
        if (!_.isStringNotEmpty(path))
        {
            return '';
        }
        return path.replace(/^public/i, '');
    }

    static create(path, name = 'File')
    {
        return this.collection.insert({
            path: this.localFolder+path,
            name,
        });
    }
}
