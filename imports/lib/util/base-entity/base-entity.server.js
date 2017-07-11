import Side from './../side.js';
import Entity from './base-entity.js';

Side.ensureServer();

export default class BaseEntity extends Entity
{
    static delete()
    {
        console.dir('remove all with');
        this.check();
        //console.dir(this.collection);
        //this.collection.remove({});
    }

    delete()
    {
        console.dir('remove all with (instance)');
        this.check();
        //console.dir(this.collection);
        //this.collection.remove({});
    }
}
