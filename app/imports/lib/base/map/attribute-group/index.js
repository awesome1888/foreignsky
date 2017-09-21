export default class AttributeGroup
{
    _data = null;
    _parameters = null;

    constructor(data)
    {
        this._data = this.check(data);
    }

    isAttribute()
    {
        return false;
    }

    getData()
    {
        return this._data;
    }

    getTitle()
    {
        return this._data.title || '';
    }

    clone()
    {
        // todo: copy parameters?
        return new this.constructor(this._data);
    }

    hasParameter(name)
    {
        return this._parameters && name in this._parameters;
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

    check(data)
    {
        return data;
    }
}
