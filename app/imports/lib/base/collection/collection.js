import {Mongo} from 'meteor/mongo';
import BulkContext from './bulk-context/bulk-context.js';

/**
 * Here we use composition, not inheritance, to be able to work with already exited collections
 * like Mongo.users or other third-party collections
 */
export default class BaseCollection
{
    _collection = null;
    _initialized = false;

    constructor(collection)
    {
        if (_.isStringNotEmpty(collection))
        {
            this._collection = new Mongo.Collection(collection);
        }
        else
        {
            this._collection = collection;
        }

        // this.createIndexes();
        this.applyHooks();
    }

    initialize(map)
    {
        if (this.isInitialized())
        {
            throw new Error('The collection was already initialized');
        }

        this.getCollection().attachSchema(map.getSchema());
        this.getCollection().addLinks(map.getLinks());

        this.setInitialized();
    }

    /**
     * This will apply low-level hooks on the collection
     */
    applyHooks()
    {
        // this.before.insert((id, data) => {
        // });
        // this.before.update((id, data, fieldNames, modifier) => {
        // });
    }

    // getSchema()
    // {
    //     return this._schema;
    // }

    // setSchema(schema)
    // {
    //     this.attachSchema(schema);
    // }

    // getLinks()
    // {
    //     return this._links;
    // }

    // setLinks(links)
    // {
    //     this.addLinks(links);
    // }

    setInitialized()
    {
        this._initialized = true;
    }

    isInitialized()
    {
        return this._initialized;
    }

    // getIndexes()
    // {
    //     return [
    //         {
    //             fields: {
    //                 search: "text",
    //             },
    //             options: {
    //                 name: 'search',
    //             },
    //         }
    //     ];
    // }

    getName()
    {
        return this.getCollection()._name;
    }

    getNameNormalized()
    {
        return this.getName().replace('.', '_').toLowerCase();
    }

    updateMany(filter, changes)
    {
        if (
            _.isObject(changes)
            &&
            !('$set' in changes)
            &&
            !('$unset' in changes)
        )
        {
            // then a short form of $set passed
            changes = {$set: changes};
        }

        return this.getRawCollection().updateMany(
            filter,
            changes,
        );
    }

    createBulkContext()
    {
        return new BulkContext(this);
    }

    getRawCollection()
    {
        return this.getCollection().rawCollection();
    }

    getCollection()
    {
        return this._collection;
    }

    /** Forwarded method calls below */

    batchInsert()
    {
        return this.getCollection().batchInsert(...arguments);
    }

    /**
     * for grapher, temporal
     * @returns {*}
     */
    createQuery()
    {
        return this.getCollection().createQuery(...arguments);
    }

    insert()
    {
        return this.getCollection().insert(...arguments);
    }

    update()
    {
        return this.getCollection().update(...arguments);
    }

    remove()
    {
        return this.getCollection().remove(...arguments);
    }

    find()
    {
        return this.getCollection().find(...arguments);
    }

    findOne()
    {
        return this.getCollection().findOne(...arguments);
    }
}
