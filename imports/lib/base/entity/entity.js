import flatten from 'mongo-dot-notation';

/**
 * @abstract
 * @mixin
 */
export default class BaseEntity
{
    // this is a singleton, use collection.getName() here!
    static _cache = {
        q: {},
    };

    _data = {};
    _normalized = false;
    static _qConstructor = null;

    constructor(data = {})
    {
        if (_.isObjectNotEmpty(data))
        {
            this.data = data;
        }
    }

    get collection()
    {
        return this.prototype.constructor.collection;
    }

    get id()
    {
        return this.data._id;
    }

    get data()
    {
        if (!this._normalized)
        {
            this._data = this.normalizeData(this._data);
            this._normalized = true;
        }

        return this._data;
    }

    set data(data)
    {
        this._data = data;
    }

    normalizeData(data)
    {
        return data;
    }

    static get collection()
    {
        throw new Error('Not implemented: get collection()');
    }

    static prepareQuery(condition)
    {
        if (this.isQuery(condition))
        {
            return condition;
        }
        else
        {
            return this.createQuery({
                filter: condition,
                select: '*',
            });
        }
    }

    static get rawCollection()
    {
        return this.collection.rawCollection();
    }

    static flatten(value)
    {
        return flatten(value).$set;
    }

    static isQuery(value)
    {
        return value instanceof this.getSampleQConstructor();
    }

    static createQuery(parameters, name = '')
    {
        if (_.isStringNotEmpty(name) && name in this._cache.q)
        {
            return this._cache.q[name];
        }

        const q = this.collection.createQuery(
            this.translateParameters(parameters)
        );

        if (_.isStringNotEmpty(name))
        {
            this._cache.q[name] = q;
        }
        
        return q;
    }

    static getSampleQConstructor()
    {
        if (this._qConstructor === null)
        {
            const sample = this.collection.createQuery();
            this._qConstructor = sample.constructor;
        }

        return this._qConstructor;
    }

    static translateParameters(parameters)
    {
        if (!_.isObjectNotEmpty(parameters))
        {
            return {};
        }

        const translated = {};

        // todo: implement * in select
        if (_.isArrayNotEmpty(parameters.select))
        {
            parameters.select.forEach((field) => {
                translated[field] = 1;
            });
        }
        else if (_.isObjectNotEmpty(parameters.select))
        {
            Object.assign(translated, parameters.select);
        }

        translated.$options = translated.$options || {};

        if (_.isArrayNotEmpty(parameters.sort))
        {
            translated.$options.sort = this.translateParamtersSort(parameters.sort);
        }

        if (_.isObjectNotEmpty(parameters.filter))
        {
            translated.$filters = parameters.filter;
        }
        else if(_.isFunction(parameters.filter))
        {
            translated.$filter = parameters.filter;
        }

        if (!('$filter' in translated)) {
            translated.$filter = this.getFilterApplier();
        }

        if ('limit' in parameters)
        {
            translated.$paginate = true;
            translated.$options.limit = parseInt(parameters.limit);
        }
        if ('offset' in parameters)
        {
            translated.$paginate = true;
            translated.$options.offset = parseInt(parameters.offset);
        }
        
        return translated;
    }

    static getFilterApplier() {
        return ({filters, params}) => {
            if (_.isObject(params.filter)) {
                Object.assign(filters, params.filter);
            }
        };
    }

    static translateParamtersSort(sort)
    {
        return sort.reduce((result, item) => {

            // todo: this will be unordered
            result[item[0]] = item[1] === 1 ? 1 : -1;

            // qParameters.$options.sort.push([
            // 	item[0], // todo: check legal field
            // 	item[1] === 'desc' ? 'desc' : 'asc'
            // ]);

            return result;
        }, {});
    }

    static clearCaches()
    {
        this._cache = {
            q: {}
        };
    }

    static resolveEntityConstructor(name)
    {
        const resolverName = `${name}Constructor`;
        if (!_.isFunction(this[resolverName]))
        {
            throw new Error(`Entity resolver for entity ${name} ('static get ${resolverName}() {...}') is not implemented`);
        }

        return this[resolverName];
    }

    isEntity(arg)
    {
        return arg instanceof this.constructor;
    }
}
