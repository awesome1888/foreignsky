import PublicationBase from '../../../lib/base/publication/index.server.js';
import Entity from '../entity/entity.server.js';
import Globals from '../../../lib/globals.js';

export default class Publication extends PublicationBase
{
    static getEntity()
    {
        return Entity;
    }

    static getFilter()
    {
        return {
            public: true,
            $or: [
                {appId: {$exists: false}},
                {appId: null},
                {appId: Globals.getApplicationId()},
            ],
            // todo: userIs is null or equals to the current one
        };
    }

    static getFields()
    {
        return {_id: 1, name: 1, value: 1, public: 1, userId: 1, appId: 1};
    }
}
