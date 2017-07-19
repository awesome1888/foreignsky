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

    static get collection()
    {
        throw new Error('Not implemented: get collection()');
    }

    get collection()
    {
        return this.prototype.constructor.collection;
    }

    static get rawCollection()
    {
        return this.collection.rawCollection();
    }

    static flatten(value)
    {
        return flatten(value).$set;
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
        
        this.patchQuery(q);

        if (_.isStringNotEmpty(name))
        {
            this._cache.q[name] = q;
        }

        return q;
    }

    static patchQuery(q)
    {
        q.filter = function(params) {
            console.dir('set filter');
            console.dir(this);
            return this;
        }.bind(q);
    }
    
    static translateParameters(parameters)
    {
        if (!_.isObjectNotEmpty(parameters))
        {
            return {};
        }

        const translated = {};

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
}
