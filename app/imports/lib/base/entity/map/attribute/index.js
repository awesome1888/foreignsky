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

    isBoolean()
    {
        return this._data.type === Boolean;
    }

    isDate()
    {
        return this._data.type === Date;
    }

    isArrayOfBoolean()
    {
        const a = this._data;
        return a.type === Array && a.type === Boolean;
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
}
