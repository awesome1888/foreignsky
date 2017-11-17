import BaseMethod from '../../../lib/base/entity/method/method.js';
import Entity from '../entity/entity.server.js';

export default class Method extends BaseMethod
{
    static getEntity()
    {
        return Entity;
    }
}
