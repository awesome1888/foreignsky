import Side from './../side.js';
import Entity from './base-entity.js';

Side.ensureServer();

export default class BaseEntity extends Entity
{
    static expose()
    {
    }
}
