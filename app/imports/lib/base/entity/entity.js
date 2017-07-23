import flatten from 'mongo-dot-notation';
// import Util from '../../util.js';
import clone from 'clone';

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
        return this.constructor.collection;
    }

    static get entityMap()
    {
        return {};
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
        this.throwNotImplemented('static get collection()');
    }

    static prepareQuery(condition)
    {
        if (this.isQuery(condition))
        {
            return condition;
        }
        else
        {
            return this.createQuery(condition);
        }
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

        this.patchQueryPrototype(q);

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

        // todo: implement * in select here
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
            translated.$options.skip = parseInt(parameters.offset);
        }
        
        return translated;
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

    /**
     * nasty
     */
    static patchQueryPrototype(q)
    {
        if (!('filter' in q.constructor.prototype))
        {
            q.constructor.prototype.filter = this.getFilterForwarder();
        }
    }

    static getFilterApplier() {
        return ({filters, params}) => {
            if (_.isObject(params.filter)) {
                Object.assign(filters, params.filter);
            }
        };
    }

    static getFilterForwarder()
    {
        return function (filter) {
            this.setParams({
                filter,
            });

            return this;
        };
    }

    static throwNotImplemented(fn)
    {
        throw new Error(`Not implemented: ${fn}`);
    }

    isEntity(arg)
    {
        return arg instanceof this.constructor;
    }

    static resolveEntityConstructor(name)
    {
        const resolver = this.entityMap[name];
        if (!_.isFunction(resolver))
        {
            throw new Error(`Unable to get entity '${name}' class constructor`);
        }

        return resolver;
    }

    static get attributes()
    {
        const result = [];
        _.forEach(this.collection.schema, (attribute, code) => {
            result.push({
                code,
                label: attribute.label,
                type: attribute.type,
            });
        });

        // result.sort(Util.getNumericComparator());

        return result;
    }

    get attributes()
    {
        return this.constructor.attributes.map((attribute) => {
            const getter = attribute.code;
            let value = undefined;
            if (getter in this)
            {
                value = this[getter];
            }

            const item = clone(attribute, false, 1);
            item.value = value;

            return item;
        });
    }

    makeInstances(point, type)
    {
        if (_.isArray(point))
        {
            // todo: optimize this
            return point.map((item, k) => {
                if (this.isEntity(item)) {
                    return item;
                }
                if (_.isObjectNotEmpty(item)) {
                    // make entity
                    const constr = this.constructor.resolveEntityConstructor(type);
                    point[k] = new constr(item);

                    return point[k];
                }

                return null;
            }).filter(item => item !== null);
        }

        return [];
    }

    forEach(cb)
    {
        if (!_.isFunction(cb))
        {
            return;
        }

        this.attributes.forEach((attribute) => {
            cb(attribute);
        });
    }

    map(cb)
    {
        if (!_.isFunction(cb))
        {
            return;
        }

        const result = [];

        this.forEach((item) => {
            result.push(cb(item));
        });

        return result;
    }
}
