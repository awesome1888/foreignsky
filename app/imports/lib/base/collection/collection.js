import {Mongo} from 'meteor/mongo';
import BulkContext from './bulk-context/bulk-context.js';

export default class BaseCollection extends Mongo.Collection
{
    _schema = null;
    _links = null;

    initialized = false;

    constructor(collectionName)
    {
        super(collectionName);
        // this.attachSchema(this.getSchema());
        // this.addLinks(this.getLinks());
        // this.createIndexes();
        this.applyHooks();
    }

    static initializeFromSource(collection, map)
    {
        collection.attachSchema(map.getSchema());
        collection.addLinks(map.getLinks());

        collection.initialized = true;
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

    getSchema()
    {
        return this._schema;
    }

    // setSchema(schema)
    // {
    //     this.attachSchema(schema);
    // }

    getLinks()
    {
        return this._links;
    }

    // setLinks(links)
    // {
    //     this.addLinks(links);
    // }

    // setInitialized()
    // {
    //     this.initialized = true;
    // }
    //
    // isInitialized()
    // {
    //     return this.initialized;
    // }

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
        return this._name;
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

        return this.rawCollection().updateMany(
            filter,
            changes,
        );
    }

    createBulkContext()
    {
        return new BulkContext(this);
    }
}
