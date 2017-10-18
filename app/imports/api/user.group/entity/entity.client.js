import BaseEntity from '../../../lib/base/entity/entity.client.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import map from '../map/map.client.js';

import ConsoleOutput from '../../../lib/util/console-output/index.js';

export default class UserGroup extends mix(BaseEntity).with(Entity)
{
    static _id2code = {};
    
    static getMapInstance()
    {
        return map;
    }

    static getTitle()
    {
        return 'User group';
    }
    
    static loadData()
    {
        return this.find({select: ['code']}, {returnArray: true}).then((res) => {
            ConsoleOutput.dir('Groups data loaded...');
            res.forEach((item) => {
                this._id2code[item._id] = item.code;
            });
        });
    }

    static getCodeById(id)
    {
        return this._id2code[id] || null;
    }
}
