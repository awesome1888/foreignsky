import PublicationBase from '../../../lib/base/publication/index.server.js';
import Entity from '../entity/entity.server.js';

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
        };
    }

    static getFields()
    {
        return {_id: 1, name: 1, value: 1};
    }
}