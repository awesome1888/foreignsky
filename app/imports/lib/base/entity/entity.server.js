import Side from './../../util/side.js';
import Entity from './entity.js';

Side.ensureOnServer();

export default class BaseEntity extends Entity
{
    static findById(id, params = {})
    {
        const qParams = {filter: {_id: id}};
        if ('select' in params)
        {
            qParams.select = params.select;
        }

        return this.findOne(qParams);
    }

    static findOne(condition = {})
    {
        if (!_.isObject(condition))
        {
            throw new TypeError('Argument should be an object and may contain keys "filter", "select", etc.');
        }

        condition.limit = 1;
        const data = this.find(condition);

        if (_.isArrayNotEmpty(data))
        {
            return new this(data[0]);
        }

        return null;
    }

    /**
     * @param condition
     */
    static find(condition = {})
    {
        return this.createQuery(condition).fetch().reduce((result, data) => {
            // make instance
            result.push(new this(data));
            return result;
        }, []);
    }

    /**
     * Server-side, sync
     * todo: rename to countGrapher
     * @param filter
     * @returns {*}
     */
    static getCount(filter)
    {
        return this.getCollection().createQuery({
            $filters: filter
        }).getCount();
    }

    getRawCollection()
    {
        return this.getCollection().rawCollection();
    }

    /**
     * todo: think about the result object...
     * @param id
     * @param data
     * @returns {*}
     */
    static save(id, data)
    {
        const collection = this.getCollection();
        if (!id) {
            return collection.insert(data);
        } else {
            if(collection.update({
                _id: id,
            }, {
                $set: this.flatten(data),
            }))
            {
                return id;
            }

            return false;
        }
    }

    /**
     * todo: think about the result object...
     * @param id
     */
    static delete(id)
    {
        if (!_.isStringNotEmpty(id))
        {
            return false;
        }

        return this.getCollection().remove({
            _id: id,
        });
    }

    static getRawCollection()
    {
        return this.getCollection().rawCollection();
    }

    save(data)
    {
        throw new Error('Not implemened: save()');
    }

    delete()
    {
        throw new Error('Not implemened: delete()');
    }

    /**
     * @deprecated
     */
    static exposeGrapher()
    {
        this.collection.expose({
            maxLimit: 1000,
            maxDepth: 5,
            // restrictedFields: this.restrictedFields, // array of fields you want to restrict
            method: true,
            publication: false,
            //restrictLinks: this.restrictedLinks,
            //body, // object that will intersect with the actual request body from the client
        });
    }
}
