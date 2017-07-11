import BaseEntity from '../../../lib/util/base-entity/base-entity.client.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';

export default class Article extends mix(BaseEntity).with(Entity)
{
    static test()
    {
        console.dir('I am on client');
        console.dir(this.window);
        this.check();
    }

    test()
    {
        console.dir('I am on client (instance)');
        console.dir(this.window);
        this.check();
    }
}
