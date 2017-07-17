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
        throw new Error('Not implemented');
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

    static createQuery(parameters, name)
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

    static translateParameters(parameters)
    {
        if (!_.isObjectNotEmpty(parameters))
        {
            return {};
        }

        if (_.isArrayNotEmpty(parameters.select))
        {
            parameters.select.forEach((field) => {
                parameters[field] = 1;
            });
        }

        if (_.isObjectNotEmpty(parameters.filters)) {
            parameters.$filters = parameters.filters;
        }

        return parameters;
    }

    static clearCaches()
    {
        this._cache = {
            q: {}
        };
    }
}
