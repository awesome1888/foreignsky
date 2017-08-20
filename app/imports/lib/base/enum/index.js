export default class Enum
{
    _items = [];
    _k2v = null;
    _v2k = null;

    constructor(declaration)
    {
        if (!_.isArrayNotEmpty(declaration))
        {
            throw new TypeError('Not a declaration');
        }

        this._items = declaration;
    }

    getKey(value)
    {
        if (!this._k2v)
        {
            this._k2v = this.makeMap('value', 'key');
        }

        return this._k2v[value];
    }

    getValue(key)
    {
        if (!this._v2k)
        {
            this._v2k = this.makeMap('key', 'value');
        }

        return this._v2k[key];
    }

    getKeys()
    {
        return this.get('key');
    }

    getValues()
    {
        return this.get('value');
    }

    get(key)
    {
        return this._items.reduce((result, item) => {
            if (key in item)
            {
                result.push(item[key]);
            }
            return result;
        }, []);
    }

    selectize()
    {
        // todo
    }

    makeMap(keyAs = null, valueAs = null)
    {
        keyAs = keyAs || 'key';
        valueAs = valueAs || 'value';

        return this._items.reduce((result, item) => {
            result[item[keyAs]] = item[valueAs];
            return result;
        }, {});
    }
}
