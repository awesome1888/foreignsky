export default class Attribute
{
    _data = null;

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
        return this._data.type === String;
    }

    isBoolean()
    {
        return this._data.type === Boolean;
    }

    isDate()
    {
        return this._data.type === Date;
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

    isArrayOfBoolean()
    {
        const a = this._data;
        return _.isArray(a.type) && a.type[0] === Boolean;
    }

    isArray()
    {
        return _.isArray(this._data.type);
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

    getMax()
    {
        if ('maxCount' in this._data)
        {
            return parseInt(this._data.maxCount);
        }
        return 9999999;
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
