import Method from '../../../lib/base/entity/method/method.js';
import Entity from '../entity/entity.server.js';

export default class extends Method
{
    static getEntity()
    {
        return Entity;
    }
}
