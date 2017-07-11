import Side from './../side.js';
import Entity from './base-entity.js';

Side.ensureClient();

export default class BaseEntity extends Entity
{
    static get window()
    {
        // just for demo
        return window;
    }

    get window()
    {
        // just for demo
        return window;
    }
}
