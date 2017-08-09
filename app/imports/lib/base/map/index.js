import { Mongo } from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import clone from 'clone';

import Attribute from './attribute/index.js';

export default class Map
{
    _attributes = [];

    static createFromCollection(collection)
    {
        if (!(collection instanceof Mongo.Collection))
        {
            throw new TypeError('Not a collection');
        }

        const attributes = [];
        let order = 0;

        const schema = collection.getSchema(); // object
        const links = collection.getLinks();
        const linkRefs = _.invert(_.uniq(_.map(links, (link) => {
            return link.field;
        })));

        _.forEach(schema, (attribute, code) => {
            if (code in linkRefs)
            {
                return;
            }

            attributes.push(new Attribute({
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

            attributes.push(new Attribute(fData));

            order += 1;
        });

        const result = new this();
        result.setAttributes(attributes);

        return result;
    }

    // static createFromSchema(schema)
    // {
    //     if (!(schema instanceof SimpleSchema))
    //     {
    //         throw new TypeError('Not a schema');
    //     }
    //
    //     const attributes = [];
    //     let order = 0;
    //
    //
    //
    //     const result = new this();
    //     result.setAttributes(attributes);
    //
    //     return result;
    // }

    setAttributes(attributes)
    {
        this._attributes = attributes;
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
