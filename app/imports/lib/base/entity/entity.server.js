import Side from './../../util/side.js';
import Entity from './entity.js';
import Exposition from '../../../lib/base/exposition/exposition.js';

Side.ensureServer();

export default class BaseEntity extends Entity
{
    static expCtrl = null;

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

    static save(id, data)
    {

    }

    static delete(id)
    {

    }

    static getRawCollection()
    {
        return this.getCollection().rawCollection();
    }

    static getExpositionController()
    {
        return Exposition;
    }

    static expose()
    {
        // todo: this will break the inheritance (static cache)! fix!
        if(this.expCtrl === null)
        {
            const ctrl = this.getExpositionController();
            this.expCtrl = new ctrl(this);
        }
    }

    /**
     * @deprecated
     */
    static exposeGrapher()
    {
        this.collection.expose({
            // firewall: this.restrictExpositionGrapher.bind(this),
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
