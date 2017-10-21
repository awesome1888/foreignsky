import BaseEntity from '../../../lib/base/entity/entity.client.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import map from '../map/map.client.js';

import ConsoleOutput from '../../../lib/util/console-output/index.js';

export default class UserGroup extends mix(BaseEntity).with(Entity)
{
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
        return this.executeMethod('getCodeMap').then((map) => {
            ConsoleOutput.dir('Groups data loaded...');

            this._id2code = map;
        });
    }

    static getCodeById(id)
    {
        return this._id2code[id] || null;
    }
}
