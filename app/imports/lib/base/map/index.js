import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import Attribute from './attribute/index.js';
import Enum from '../enum/index.js';

export default class Map
{
    _attributes = [];
    _aIndex = null;
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
            let order = 0;
            definition.forEach((item) => {
                if (item instanceof Attribute)
                {
                    result.push(item);
                }
                else
                {
                    item.order = order;
                    result.push(new Attribute(
                        item
                    ));
                    order += 1;
                }
            });
        }

        return result;
    }

    /**
     * This should be defined for both client and server sides
     * @returns {{}}
     */
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

    $(name)
    {
        return this.resolveEntityConstructor(name);
    }

    decomposeMapCached()
    {
        if (!this._parts)
        {
            this._parts = {};

            const {schema, links} = this.decomposeMap();

            this._parts.schema = new SimpleSchema(schema);
            this._parts.links = links;
        }

        return this._parts;
    }

    /**
     * Converts current map into a SimpleSchema and Grapher Links
     * @returns {{schema: {}, links: {}}}
     */
    decomposeMap()
    {
        const schema = {};
        const links = {};

        this.forEach((a) => {
            if (!(a instanceof Attribute))
            {
                return;
            }

            if (a.isLink() || a.isArrayOfLink())
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
                else if(a.isArrayOfMap())
                {
                    item.type = [item.type[0].getSchema()];
                }

                if (a.isArray() && !_.isFunction(a.getCustom()) && !a.isOptional())
                {
                    // we do not accept "length 1" array of undefined as "filled" value
                    item.custom = Attribute.getStrictArrayCondition(a.getCode());
                }

                const aValues = a.getAllowedValues();
                if (aValues instanceof Enum)
                {
                    item.allowedValues = aValues.getKeys();
                }

                schema[a.getCode()] = item;
            }
        });

        return {schema, links};
    }

    getSchema()
    {
        return this.decomposeMapCached().schema;
    }

    getLinks()
    {
        return this.decomposeMapCached().links;
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

    /**
     * Returns a sub-map according by the filter
     * @param filter
     */
    filter(filter)
    {
        if (!_.isFunction(filter))
        {
            filter = x => true;
        }

        const attributes = [];
        this.forEach((attribute) => {

            if (filter(attribute) === false)
            {
                return;
            }

            let attr = attribute.clone();

            if (attribute instanceof Attribute)
            {
                // filter sub-maps
                if (attribute.isMap())
                {
                    attr.setType(attr.getType().filter(filter));
                }
                else if(attribute.isArrayOfMap())
                {
                    attr.setArrayType(attr.getArrayType().filter(filter));
                }
            }

            attributes.push(attr);
        });
        
        return new this.constructor(attributes);
    }

    makeRefCode(code)
    {
        return `${code}Id`;
    }

    /**
     * Generates a reference field declaration that will represent the corresponding link-type field in SimpleSchema
     * @param attribute
     * @returns {{type: *, optional: *, regEx: RegExp, label: string, minCount: number}}
     */
    makeRefField(attribute)
    {
        const field = {
            type: attribute.isArray() ? [String] : String,
            optional: attribute.getOptional(),
            regEx: SimpleSchema.RegEx.Id,
            minCount: 0, // we cant add "pre-defined" links
        };
        if (attribute.isArray() && !_.isFunction(attribute.getCustom()) && !attribute.isOptional())
        {
            // we do not accept "length 1" array of undefined as "filled" value
            field.custom = Attribute.getStrictArrayCondition(
                this.makeRefCode(attribute.getCode())
            );
        }

        return field;
    }

    /**
     * Create surrogate "link" field on the basis of the reference field
     * @param attribute
     * @returns {Attribute}
     */
    makeRefAttribute(attribute)
    {
        const f = this.makeRefField(attribute);
        f.isReference = true;
        f.code = this.makeRefCode(attribute.getCode());
        f.label = attribute.getTitle();
        
        const a = new Attribute(f);
        a.setParameter('entity',  attribute.getLinkType());
        a.setParameter('linkCode',  attribute.getCode());

        return a;
    }

    getAttribute(code)
    {
        this.createIndex();

        if (this._aIndex[code])
        {
            return this._aIndex[code].attribute;
        }

        return null;
    }

    getAttributeIndex(code)
    {
        this.createIndex();

        if (this._aIndex[code])
        {
            return this._aIndex[code].i;
        }

        return -1;
    }

    createIndex()
    {
        if (!this._aIndex) {
            this._aIndex = this._attributes.reduce((result, item, i) => {
                result[item.getCode()] = {attribute: item, i};
                return result;
            }, {});
        }
    }

    clearCaches()
    {
        this._aIndex = null;
    }

    clone()
    {
        const attributes = [];
        this.forEach((attribute) => {
            attributes.push(attribute.clone());
        });

        return new this.constructor(attributes);
    }

    getCutawayAttribute()
    {
        const first = this._attributes[0];
        if (first instanceof Attribute)
        {
            return first;
        }

        return null;
    }

    /**
     * Generates mongo query projection (which fields to select) according the current map
     * @returns {{}}
     */
    getProjection()
    {
        const projection = {};
        this.forEach((attribute) => {
            if (!(attribute instanceof Attribute))
            {
                return;
            }

            let way = 1;
            if (attribute.isMap() || attribute.isArrayOfMap())
            {
                way = attribute.getBaseType().getProjection();
            }
            if (attribute.isLink() || attribute.isArrayOfLink())
            {
                way = attribute.getBaseType().getMap().getProjection();
                // get also the reference field value
                projection[this.makeRefCode(attribute.getCode())] = 1;
            }

            projection[attribute.getCode()] = way;
        });

        return projection;
    }

    /**
     * Generates mongo query projection (which fields to select) according the current map.
     * In this case, fields, marked as autoSelect: false will not be selected
     * @returns {{}}
     */
    getAutoSelectableProjection()
    {
        const projection = {};
        this.forEach((attribute) => {
            if (!(attribute instanceof Attribute))
            {
                return;
            }

            if (attribute.isAutoSelectable())
            {
                let way = 1;
                if (attribute.isMap() || attribute.isArrayOfMap())
                {
                    way = attribute.getBaseType().getAutoSelectableProjection();
                }
                if (attribute.isLink() || attribute.isArrayOfLink())
                {
                    way = attribute.getBaseType().getMap().getAutoSelectableProjection();
                    // get also the reference field value
                    projection[this.makeRefCode(attribute.getCode())] = 1;
                }

                projection[attribute.getCode()] = way;
            }
        });

        return projection;
    }

    // tune functions

    tuneAttribute(code, data = {})
    {
        // todo
    }

    removeAttribute(code)
    {
        this._attributes = this._attributes.filter(item => item.getCode() !== code);
        this.clearCaches();
    }

    /**
     * Remove all attributes but specified in the list
     * @param list
     */
    leaveOnly(list)
    {
        if (!_.isArray(list))
        {
            return;
        }

        this._attributes = this._attributes.filter(item => list.indexOf(item.getCode()) >= 0);
        this.clearCaches();
    }

    insertAttributeAfter(attribute, afterCode = null)
    {
        // if (this._attributes.length < 2)
        // {
        //     return;
        // }

        let i = false;
        if (_.isStringNotEmpty(attribute))
        {
            // existing attribute
            i = this.getAttributeIndex(code);
        }
        else if(_.isObject(attribute))
        {
            // newly created attribute
            // not only instances of Attribute are suitable here, but you should
            // know what you are doing
            i = -1;
        }

        if (i !== false)
        {
            let attr;
            if (i >= 0) // move an existing attribute
            {
                attr = this._attributes.splice(i, 1)[0];
                this.clearCaches();
            }
            else
            {
                attr = attribute;
            }

            if (_.isStringNotEmpty(afterCode))
            {
                const aI = this.getAttributeIndex(afterCode);
                this._attributes.splice(aI + 1, 0, attr);
            }
            else
            {
                this._attributes.unshift(attr);
            }
        }

        this.clearCaches();
    }
}
