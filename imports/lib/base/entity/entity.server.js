import Side from './../../util/side.js';
import Entity from './entity.js';

Side.ensureServer();

export default class BaseEntity extends Entity
{
    static restrictExposition(filters, options, userId)
    {
    }

    static expose()
    {
        this.collection.expose({
            firewall: this.restrictExposition.bind(this),
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
     * @param filter
     * @returns {*}
     */
    static count(filter)
    {
        return this.collection.createQuery({
            $filters: filter
        }).getCount();
    }

    static find(condition = {})
    {
        return this.createQuery(condition).fetch().reduce((result, data) => {
            // make instance
            result.push(new this(data));
            return result;
        }, []);
    }
}
