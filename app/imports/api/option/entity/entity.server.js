import BaseEntity from '../../../lib/base/entity/entity.server.js';
// import Exposition from '../exposition/exposition.js';
import Entity from './entity.js';
import mix from '../../../lib/mixin.js';
import map from '../map/map.client.js';

export default class Option extends mix(BaseEntity).with(Entity)
{
    static getMapInstance()
    {
        return map;
    }

    static set(name, value, parameters = {})
    {
        const data = {
            value: {value},
        };

        parameters = parameters || {};
        if ('public' in parameters) {
            data.public = !!parameters.public;
        }
        if ('userId' in parameters) {
            data.userId = parameters.userId;
        }
        if ('appId' in parameters) {
            data.appId = parameters.appId;
        }

        // do not use upsert, simple schema fails on it

        if (this.isDefined(name, parameters))
        {
            return this.getCollection().update({
                name,
            }, {
                $set: data,
            });
        }
        else
        {
            data.name = name;
            if (this.getCollection().insert(data))
            {
                return true;
            }
        }
    }

    static unSetAll(name)
    {
        return this.getCollection().remove({
            name
        });
    }

    static getValueOne(name)
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

    // static getIncrementalCounter(name, start = 0)
    // {
    //     let value = parseInt(this.getValueOne(name), 10);
    //     if (isNaN(value))
    //     {
    //         value = start;
    //     }
    //
    //     this.set(name, value + 1);
    //
    //     return value;
    // }

    static makePublic(name)
    {
        if (!_.isStringNotEmpty(name))
        {
            return false;
        }

        return this.getCollection().update({
            name,
        }, {
            $set: {
                public: true,
            },
        });
    }

    static makePrivate(name)
    {
        if (!_.isStringNotEmpty(name))
        {
            return false;
        }

        return this.getCollection().update({
            name,
        }, {
            $set: {
                public: false,
            },
        });
    }

    static isDefined(name, parameters = {})
    {
        if (!_.isStringNotEmpty(name))
        {
            return false;
        }

        const filter = {
            name,
        };

        parameters = parameters || {};
        if ('public' in parameters) {
            filter.public = !!parameters.public;
        }
        if ('userId' in parameters) {
            filter.userId = parameters.userId;
        }
        if ('appId' in parameters) {
            filter.appId = parameters.appId;
        }

        const item = this.getCollection().findOne(filter, {
            _id: 1,
        });

        return _.isObjectNotEmpty(item);
    }
}
