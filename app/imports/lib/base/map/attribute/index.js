import Map from '../../map/index.js';
import Entity from '../../entity/entity.js';
import Enum from '../../enum/index.js';

export default class Attribute
{
    _data = null;
    _parameters = null;

    static getStrictArrayCondition(name)
    {
        return function ()
        {
            let value = this.field(name).value;
            if (!_.isArray(value))
            {
                return null;
            }

            value = value.filter(item => item !== undefined);

            if (!_.isArrayNotEmpty(value))
            {
                return 'required';
            }

            return null;
        };
    }

    constructor(data)
    {
        this._data = data;
    }

    isString()
    {
        return this._data.type === String;
    }

    isNumber()
    {
        return this._data.type === Number;
    }

    isBoolean()
    {
        return this._data.type === Boolean;
    }

    isDate()
    {
        return this._data.type === Date;
    }

    isMap()
    {
        return this._data.type instanceof Map;
    }

    isLink()
    {
        return this._data.type.prototype instanceof Entity;
    }

    isArray()
    {
        return _.isArray(this._data.type);
    }

    isArrayOfString()
    {
        const a = this._data;
        return this.isArray() && a.type[0] === String;
    }

    isArrayOfNumber()
    {
        const a = this._data;
        return this.isArray() && a.type[0] === Number;
    }

    isArrayOfBoolean()
    {
        const a = this._data;
        return this.isArray() && a.type[0] === Boolean;
    }

    isArrayOfDate()
    {
        const a = this._data;
        return this.isArray() && a.type[0] === Date;
    }

    isArrayOfMap()
    {
        const a = this._data;
        return this.isArray() && a.type[0] instanceof Map;
    }

    isArrayOfLink()
    {
        const a = this._data;
        return this.isArray() && (a.type[0].prototype instanceof Entity);
    }

    isLinkAny()
    {
        return this.isLink() || this.isArrayOfLink();
    }

    isReference()
    {
        return !!this._data.isReference;
    }

    getLinkCollection()
    {
        if (this.isLink())
        {
            return this._data.type.getCollection();
        }
        else if (this.isArrayOfLink())
        {
            return this._data.type[0].getCollection();
        }

        return null;
    }

    getLinkType()
    {
        if (this.isLink())
        {
            return this.getType();
        }
        else if(this.isArrayOfLink())
        {
            return this.getArrayType();
        }

        return null;
    }

    getBaseType()
    {
        return this.getArrayType() || this.getType();
    }

    // special
    isArrayOfStringDiscreet()
    {
        const a = this._data;
        return  this.isArray()
                && a.type[0] === String
                && (_.isArray(a.allowedValues) || a.allowedValues instanceof Enum);
    }

    getData()
    {
        return this._data;
    }

    getType()
    {
        return this._data.type;
    }

    setType(type)
    {
        this._data.type = type;
    }

    getArrayType()
    {
        if (this.isArray())
        {
            return this._data.type[0];
        }

        return null;
    }

    setArrayType(type)
    {
        if (this.isArray())
        {
            return this._data.type[0] = type;
        }
    }

    getCode()
    {
        return this._data.code;
    }

    getLabel()
    {
        return this._data.label || '';
    }

    getCustom()
    {
        return this._data.custom || null;
    }

    getTitle()
    {
        return this.getLabel() || this.getCode();
    }

    getOrder()
    {
        return this._data.order;
    }

    isOptional()
    {
        return this._data.optional === true;
    }

    isPrimary()
    {
        return this.getOrder() === 0;
    }

    isAutoSelectable()
    {
        return this._data.autoSelect !== false;
    }

    hasMinCount()
    {
        return 'minCount' in this._data;
    }

    getMinCount()
    {
        const num = parseInt(this._data.minCount);
        if (!isNaN(num))
        {
            return num;
        }
        return 0;
    }

    getMaxCount()
    {
        const num = parseInt(this._data.maxCount);
        if (!isNaN(num))
        {
            return num;
        }
        return 9999999;
    }

    getOptional()
    {
        if ('optional' in this._data)
        {
            return this._data.optional;
        }

        return false;
    }

    getAllowedValues()
    {
        return this._data.allowedValues || null;
    }

    getSchemaFields()
    {
        return _.intersectKeys(this._data, {
            type: 1, optional: 1, allowedValues: 1,
            defaultValue: 1, custom: 1, label: 1,
            maxCount: 1, minCount: 1,
        });
    }

    clone()
    {
        // copy base data by value
        const copyData = _.pick(this._data, [
            'code', 'optional', 'label', 'order',
            'allowedValues', 'defaultValue', 'custom',
            'isReference',
        ]);

        // copy type
        let type = null;
        if (this.isArray())
        {
            type = [];
            if (this.isArrayOfMap())
            {
                // clone sub-map
                type.push(this.getArrayType().clone());
            }
            else
            {
                type.push(this.getArrayType());
            }
        }
        else
        {
            if (this.isMap())
            {
                // clone map
                type = this.getType().clone();
            }
            else
            {
                type = this.getType();
            }
        }

        copyData.type = type;

        // copy parameters?

        return new this.constructor(copyData);
    }

    setParameter(name, value)
    {
        if (!_.isStringNotEmpty(name))
        {
            return;
        }

        if (this._parameters === null)
        {
            this._parameters = {};
        }

        this._parameters[name] = value;
    }

    getParameter(name)
    {
        if (!_.isObject(this._parameters))
        {
            return null;
        }

        if (!(name in this._parameters))
        {
            return null;
        }

        return this._parameters[name];
    }
}
