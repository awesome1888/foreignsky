import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import Attribute from './attribute/index.js';

export default class Map
{
    _attributes = [];

    constructor(definition)
    {
        this._attributes = this.makeAttributes(definition);
    }

    makeAttributes(definition)
    {
        const result = [];

        if (_.isArrayNotEmpty(definition))
        {
            definition.forEach((item) => {
                result.push(new Attribute(
                    item
                ));
            });
        }

        return result;
    }

    getSchema()
    {
        // todo
        return {};
    }

    getLinks()
    {
        // todo
        return {};
    }

    forEach(cb)
    {
        if (_.isFunction(cb))
        {
            this._attributes.forEach(cb);
        }
    }

    map(cb)
    {
        if (_.isFunction(cb))
        {
            return this._attributes.map(cb);
        }

        return [];
    }

    tuneAttribute(code, data = {})
    {
        // todo
    }

    removeAttribute(code)
    {
        this._attributes = this._attributes.filter(item => item.getCode() !== code);
    }

    getSurrogateSchema()
    {
        return new SimpleSchema(this._attributes.reduce((result, item) => {

            result[item.getCode()] = _.intersectKeys(item.getData(), {
                type: 1, label: 1, defaultValue: 1,
                optional: 1, allowedValues: 1, maxCount: 1,
                minCount: 1, custom: 1,
            });

            return result;
        }, {}));
    }
}
