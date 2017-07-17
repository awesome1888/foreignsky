import Side from './../side.js';
import Entity from './base-entity.js';

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
}
