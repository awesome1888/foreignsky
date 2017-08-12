import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import Attribute from './attribute/index.js';

export default class Map
{
    _attributes = [];
    _parts = null;

    constructor(definition)
    {
        this.setDefinition(definition);
    }

    setDefinition(definition)
    {
        if (_.isArrayNotEmpty(definition))
        {
            this._attributes = this.makeAttributes(definition);
        }
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

    getLinkedEntityMap()
    {
        return {};
    }

    resolveEntityConstructor(name)
    {
        const resolver = this.getLinkedEntityMap()[name];
        if (!_.isFunction(resolver))
        {
            throw new Error(`Unable to get linked entity '${name}' class constructor`);
        }

        return resolver;
    }

    decomposeMap()
    {
        if (!this._parts)
        {
            this._parts = {};

            const schema = {};
            const links = {};

            this.forEach((a) => {
                if (a.isLink() || a.isLinkItem())
                {
                    const isMultiple = a.isArray();
                    const refFieldCode = this.makeRefCode(a.getCode());

                    // links for grapher
                    links[a.getCode()] = {
                        type: isMultiple ? 'many' : 'one',
                        collection: a.getLinkCollection(),
                        field: refFieldCode,
                    };

                    // add ref fields
                    schema[refFieldCode] = this.makeRefField(a);
                }
                else
                {
                    const item = a.getSchemaFields();

                    if (a.isMap())
                    {
                        item.type = item.type.getSchema();
                    }
                    else if(a.isMapItem())
                    {
                        item.type = [item.type[0].getSchema()];
                    }

                    if (a.isArray() && !_.isFunction(a.getCustom()) && !a.isOptional())
                    {
                        // we do not accept "length 1" array of undefined as "filled" value
                        item.custom = Attribute.getStrictArrayCondition(a.getCode());
                    }

                    schema[a.getCode()] = item;
                }
            });

            // console.dir(schema);
            // console.dir(links);

            this._parts.schema = new SimpleSchema(schema);
            this._parts.links = links;
        }

        return this._parts;
    }

    getSchema()
    {
        return this.decomposeMap().schema;
    }

    getLinks()
    {
        return this.decomposeMap().links;
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

    mapWithLinksReplace(cb)
    {
        if (_.isFunction(cb))
        {
            return this._attributes.map((item) => {
                if (item.isLink() || item.isLinkItem())
                {
                    item = this.makeRefAttribute(item);
                }

                return cb(item);
            });
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

    makeRefCode(code)
    {
        return `${code}Id`;
    }

    makeRefField(attribute)
    {
        const field = {
            type: attribute.isArray() ? [String] : String,
            optional: attribute.getOptional(),
            regEx: SimpleSchema.RegEx.Id,
            label: 'Reference', // `Reference to ${attribute.getCode()}`,
            minCount: 0,
        };
        if (attribute.isArray() && !_.isFunction(attribute.getCustom()) && !attribute.isOptional())
        {
            console.dir('attach!');
            // we do not accept "length 1" array of undefined as "filled" value
            field.custom = Attribute.getStrictArrayCondition(
                this.makeRefCode(attribute.getCode())
            );
        }

        return field;
    }

    makeRefAttribute(attribute)
    {
        const f = this.makeRefField(attribute);
        f.code = this.makeRefCode(attribute.getCode());

        return new Attribute(f);
    }
}
