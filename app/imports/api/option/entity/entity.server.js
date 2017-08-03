import BaseEntity from '../../../lib/base/entity/entity.server.js';
// import Exposition from '../exposition/exposition.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';

export default class Option extends mix(BaseEntity).with(Entity)
{
    static set(name, value/* , userId = '' */)
    {
        return this.getCollection().update({
            name,
        }, {
            $set: {
                name,
                value: {value},
            },
        }, {
            upsert: true,
        });
    }

    static unSet(name/* , userId = '' */)
    {
        return this.getCollection().remove({
            name
        });
    }

    static get(name/* , userId = '' */)
    {
        const item = this.getCollection().findOne({
            name,
        }, {
            value: 1,
        });

        if (item && _.isObject(item.value) && ('value' in item.value)) {
            return item.value.value;
        }

        return undefined;
    }
}
