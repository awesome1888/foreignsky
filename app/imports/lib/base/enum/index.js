/**
 * todo: possible move to immutable.js?GoogleMap
 */

export default class Enum
{
    _items = [];
    _k2v = null;
    _v2k = null;
    _k2o = null;

    constructor(declaration)
    {
        if (!_.isArray(declaration))
        {
            throw new TypeError('Illegal enum declaration');
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

    getRandomItem()
    {
        return _.sample(this._items);
    }

    getValue(key)
    {
        if (!this._v2k)
        {
            // todo: this will not work well with value duplicates
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

    getItemByKey(key)
    {
        if (!this._k2o)
        {
            this._k2o = this._items.reduce((result, item) => {
                result[item.key] = item;
                return result;
            }, {});
        }

        return this._k2o[key] || null;
    }

    getItemsByValue()
    {
        // todo: (mind the plural notation)
    }

    selectize(search = '')
    {
        let source = this._items;
        if (_.isStringNotEmpty(search))
        {
            search = search.toLowerCase();
            source = source.filter((item) => {
                // todo: search also by additional keys in the item
                return item.key.toLowerCase().indexOf(search) >= 0 || item.value.toLowerCase().indexOf(search) >= 0;
            });
        }

        return source.map((item) => {
            return {
                value: item.key,
                label: item.value,
            };
        });
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

    map(cb)
    {
        if (_.isFunction(cb))
        {
            return this._items.map(cb);
        }

        return [];
    }

    forEach(cb)
    {
        if (_.isFunction(cb))
        {
            this._items.forEach(cb);
        }
    }

    find(cb)
    {
        if (_.isFunction(cb))
        {
            return this._items.find(cb);
        }

        return false;
    }

    add(item)
    {
        this._items.push(item);
        this.clearCaches();
    }

    clearCaches()
    {
        this._k2v = null;
        this._v2k = null;
        this._k2o = null;
    }

    resort(key, comparator)
    {
        this._items.sort((a, b) => {
            return comparator(a[key], b[key]);
        });
    }
}
