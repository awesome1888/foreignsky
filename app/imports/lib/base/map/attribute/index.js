import Map from '../../map/index.js';
import Entity from '../../entity/entity.js';

export default class Attribute
{
    _data = null;

    static getStrictArrayCondition(name)
    {
        return function ()
        {
            const value = this.field(name).value;
            if (!_.isArrayNotEmpty(_.compact(value)))
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

    isStringItem()
    {
        const a = this._data;
        return this.isArray() && a.type[0] === String;
    }

    isNumberItem()
    {
        const a = this._data;
        return this.isArray() && a.type[0] === Number;
    }

    isBooleanItem()
    {
        const a = this._data;
        return this.isArray() && a.type[0] === Boolean;
    }

    isDateItem()
    {
        const a = this._data;
        return this.isArray() && a.type[0] === Date;
    }

    isMapItem()
    {
        const a = this._data;
        return this.isArray() && a.type[0] instanceof Map;
    }

    isLinkItem()
    {
        const a = this._data;
        return this.isArray() && a.type[0].prototype instanceof Entity;
    }

    isLinkAny()
    {
        return this.isLink() || this.isLinkItem();
    }

    getLinkCollection()
    {
        if (this.isLink())
        {
            return this._data.type.getCollection();
        }
        else if (this.isLinkItem())
        {
            return this._data.type[0].getCollection();
        }

        return null;
    }

    // special
    isArrayOfStringDiscreet()
    {
        const a = this._data;
        return this.isArray() && a.type[0] === String && _.isArray(a.allowedValues);
    }

    getData()
    {
        return this._data;
    }

    getType()
    {
        return this._data.type;
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

    isOptional()
    {
        return this._data.optional === true;
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

    getSchemaFields()
    {
        return _.intersectKeys(this._data, {
            type: 1, optional: 1, allowedValues: 1,
            defaultValue: 1, custom: 1, label: 1,
        });
    }

    getRenderer()
    {
        return this._data.renderer || null;
    }

    getItemRenderer()
    {
        return this._data.itemRenderer || null;
    }
}
