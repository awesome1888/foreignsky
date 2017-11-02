import Side from './../../util/side.js';
import Entity from './entity.js';

Side.ensureOnServer();

export default class BaseEntity extends Entity
{
    static findById(id, extra = {}, parameters = {})
    {
        const condition = {filter: {_id: id}};
        if ('select' in extra)
        {
            condition.select = extra.select;
        }

        return this.findOne(condition, parameters);
    }

    static findOne(condition = {}, parameters = {})
    {
        if (!_.isObject(condition))
        {
            throw new TypeError('Argument should be an object and may contain keys "filter", "select", etc.');
        }

        condition.limit = 1;
        const data = this.find(condition, parameters);

        if (_.isArrayNotEmpty(data))
        {
            return data[0];
        }

        return null;
    }

    /**
     * @param condition
     * @param parameters
     */
    static find(condition = {}, parameters = {})
    {
        const qResult = this.createQuery(condition).fetch();
        if (parameters.returnArray === true)
        {
            return qResult;
        }

        return qResult.reduce((result, data) => {
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
     * @returns boolean|string todo: probably return Result here
     */
    static save(id, data)
    {
        if (!_.isObject(data))
        {
            return false;
        }

        const collection = this.getCollection();
        if (this.onBeforeSave(id, data) === false)
        {
            return false;
        }
        if (!_.isStringNotEmpty(id))
        {
            id = collection.insert(data);
            this.onAfterSave(id, data);
            return id;
        }
        else
        {
            if(collection.update({
                _id: id,
            }, {
                $set: this.flatten(data),
            }))
            {
                this.onAfterSave(id, data);
                return id;
            }

            return false;
        }
    }

    /**
     * todo: think about the result object...
     * @param filter
     * @return boolean todo: probably return Result here
     */
    static remove(filter = {})
    {
        if (this.onBeforeRemove(filter) === false)
        {
            return false;
        }
        if (this.getCollection().remove(filter))
        {
            this.onAfterRemove(filter);
            return true;
        }

        return false;
    }

    static getRawCollection()
    {
        return this.getCollection().rawCollection();
    }

    // static hooks

    static onBeforeSave()
    {
    }

    static onAfterSave()
    {
    }

    static onBeforeRemove()
    {
    }

    static onAfterRemove()
    {
    }

    save(id, data)
    {
        throw new Error('Not implemened: save()');
    }

    remove(filter = {})
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
