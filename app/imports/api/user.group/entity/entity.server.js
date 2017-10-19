import BaseEntity from '../../../lib/base/entity/entity.server.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import map from '../map/map.server.js';

export default class UserGroup extends mix(BaseEntity).with(Entity)
{
    static getMapInstance()
    {
        return map;
    }

    static getCodeById(id)
    {
        if (this._id2code === null)
        {
            this._id2code = {};

            // load first
            this.find({select: ['code']}, {returnArray: true}).forEach((item) => {
                this._id2code[item._id] = item.code;
            });
        }

        return this._id2code[id] || null;
    }
}
