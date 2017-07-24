import Side from './../../util/side.js';
import Entity from './entity.js';
import Exposition from '../../../lib/base/exposition/exposition.js';

Side.ensureServer();

export default class BaseEntity extends Entity
{
    static expCtrl = null;

    getRawCollection()
    {
        return this.getCollection().rawCollection();
    }

    static getRawCollection()
    {
        return this.getCollection().rawCollection();
    }

    static restrictExpositionGrapher(filters, options, userId)
    {
    }

    static getExpositionController()
    {
        return Exposition;
    }

    static expose()
    {
        if(this.expCtrl === null)
        {
            this.expCtrl = new this.getExpositionController()(this);
        }
    }

    static exposeGrapher()
    {
        this.collection.expose({
            firewall: this.restrictExpositionGrapher.bind(this),
            maxLimit: 1000,
            maxDepth: 5,
            // restrictedFields: this.restrictedFields, // array of fields you want to restrict
            method: true,
            publication: false,
            //restrictLinks: this.restrictedLinks,
            //body, // object that will intersect with the actual request body from the client
        });
    }

    /**
     * Server-side, sync
     * todo: rename to countGrapher
     * @param filter
     * @returns {*}
     */
    static count(filter)
    {
        return this.getCollection().createQuery({
            $filters: filter
        }).getCount();
    }

    /**
     * todo: rename to findGrapher
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
}
