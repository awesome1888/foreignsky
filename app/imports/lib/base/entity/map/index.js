import { Mongo } from 'meteor/mongo';
import clone from 'clone';

import Attribute from './attribute/index.js';

export default class Map
{
    _attributes = [];
    _collection = null;

    constructor(collection)
    {
        if (!(collection instanceof Mongo.Collection))
        {
            throw new TypeError('Not a collection');
        }

        this._collection = collection;

        const result = [];
        let order = 0;

        const schema = collection.getSchema();
        const links = collection.getLinks();
        const linkRefs = _.invert(_.uniq(_.map(links, (link) => {
            return link.field;
        })));

        _.forEach(schema, (attribute, code) => {
            if (code in linkRefs)
            {
                return;
            }

            result.push(new Attribute({
                code,
                order,
                label: attribute.label || '',
                type: attribute.type,
                optional: attribute.optional,
            }));

            order += 1;
        });

        _.forEach(links, (attribute, code) => {
            const field = attribute.field;
            const fData = clone(schema[attribute.field]);

            fData.code = code;
            fData.order = order;

            fData.codeRef = field;
            fData.collectionRef = attribute.collection;

            result.push(new Attribute(fData));

            order += 1;
        });

        this._attributes = result;
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
