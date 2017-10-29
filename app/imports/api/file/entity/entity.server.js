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

    /**
     * @deprecated
     * @returns {string}
     */
    static getUploadFolder()
    {
        return Util.getUploadFolder();
    }

    /**
     * @deprecated
     * @returns {string}
     */
    static getLocalFolderAbsolute()
    {
        return Util.getUploadFolder()+this.getLocalFolder();
    }

    /**
     * @deprecated
     * @returns {string}
     */
    static getLocalFolder()
    {
        return 'img/';
    }

    static remove(filter = {})
    {
        if (this.onBeforeRemove(filter) === false)
        {
            return false;
        }

        // todo: remove also all the files by the filter

        if (this.getCollection().remove(filter))
        {
            this.onAfterRemove(filter);
            return true;
        }

        return false;
    }

    /**
     * @deprecated
     * @param path
     * @param name
     */
    static create(path, name = 'File')
    {
        return this.getCollection().insert({
            path: this.getLocalFolder()+path,
            name,
        });
    }

    getAbsoluteUrl()
    {
        return `${Util.getUploadFolder()}${this.getPath()}`;
    }
}
