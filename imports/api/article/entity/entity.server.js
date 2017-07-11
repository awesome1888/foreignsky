import BaseEntity from '../../../lib/util/base-entity/base-entity.server.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';

export default class Article extends mix(BaseEntity).with(Entity)
{
    static test()
    {
        console.dir('I am on server');
        this.delete();
    }

    test()
    {
        console.dir('I am on server (instance)');
        this.delete();
    }
}
