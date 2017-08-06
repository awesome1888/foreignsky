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
    static _qConstructor = null;

    _data = {};
    _normalized = false;

    static getEntityMap()
    {
        return {};
    }

    static getCollection()
    {
        this.throwNotImplemented('static getCollection()');
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

        const q = this.getCollection().createQuery(
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
            const sample = this.getCollection().createQuery();
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
        const resolver = this.getEntityMap()[name];
        if (!_.isFunction(resolver))
        {
            throw new Error(`Unable to get entity '${name}' class constructor`);
        }

        return resolver;
    }

    /**
     * This function returns the same as getCollection().getSchema(), but extended, with
     * a few new attributes and including links
     * // todo: move all to getMap()
     * // todo: make it cached
     * @returns {*}
     */
    static getMap()
    {
        const result = [];
        let order = 0;

        const schema = this.getCollection().getSchema();
        const links = this.getCollection().getLinks();
        const linkRefs = _.invert(_.uniq(_.map(links, (link) => {
            return link.field;
        })));

        _.forEach(schema, (attribute, code) => {
            if (code in linkRefs)
            {
                return;
            }

            result.push({
                code,
                order,
                label: attribute.label || '',
                type: attribute.type,
                optional: attribute.optional,
            });

            order += 1;
        });

        _.forEach(links, (attribute, code) => {
            const field = attribute.field;
            const fData = clone(schema[attribute.field]);

            fData.code = code;
            fData.order = order;

            fData.codeRef = field;
            fData.collectionRef = attribute.collection;

            result.push(fData);

            // let optional = true;
            // if (attribute.field in linkRefs)
            // {
            //     optional = !!schema[attribute.field].optional;
            // }

            // let type = null;
            // if (attribute.type === 'many') {
            //     type = [attribute.collection];
            // } else if (attribute.type === 'one') {
            //     type = attribute.collection;
            // } else {
            //     throw new Error('Link types other than "one" and "many" are not supported');
            // }
            //
            // const reference = clone(schema[attribute.field]);
            // reference.code = attribute.field;

            // result.push({
            //     code,
            //     order,
            //     label: attribute.label || '',
            //     type,
            //     optional,
            //     reference,
            // });

            order += 1;
        });

        return result;
    }

    // todo: deprecated, replace with getMap() and remove
    static getAttributes()
    {
        const result = [];
        _.forEach(this.getCollection().getSchema(), (attribute, code) => {
            result.push({
                code,
                label: attribute.label,
                type: attribute.type,
            });
        });
        
        // result.sort(Util.getNumericComparator());

        return result;
    }

    constructor(data = {})
    {
        if (_.isObjectNotEmpty(data))
        {
            this.data = data;
        }
    }

    getCollection()
    {
        return this.constructor.getCollection();
    }

    getId()
    {
        return this.data._id;
    }

    getData()
    {
        if (!this._normalized)
        {
            this._data = this.normalizeData(this._data);
            this._normalized = true;
        }

        return this._data;
    }

    seData(data)
    {
        this._data = data;
    }

    normalizeData(data)
    {
        return data;
    }

    getMap()
    {
        return this.getAttributes();
    }

    // todo: move all to getMap()
    getAttributes()
    {
        return this.constructor.getAttributes().map((attribute) => {
            const item = clone(attribute, false, 1);
            item.value = this.getAttributeValue(attribute.code);

            return item;
        });
    }

    getAttributeValue(code)
    {
        const getter = 'get'+_.lCFirst(code);
        if (_.isFunction(this[getter]))
        {
            return this[getter].call(this);
        }

        return undefined;
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

        this.getAttributes().forEach((attribute) => {
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
