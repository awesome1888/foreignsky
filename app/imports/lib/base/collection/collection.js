import {Mongo} from 'meteor/mongo';
import BulkContext from './bulk-context/bulk-context.js';

export default class BaseCollection extends Mongo.Collection
{
    _schema = null;
    _links = null;
    _initialized = false;

    constructor(collectionName)
    {
        super(collectionName);
        // this.attachSchema(this.getSchema());
        // this.addLinks(this.getLinks());
        // this.createIndexes();
        // this.applyHooks();
    }

    initializeFromSource(map)
    {
        this.setSchema(map.getSchema());
        this.setLinks(map.getLinks());

        this.setInitialized();
    }

    getSchema()
    {
        return this._schema;
    }

    setSchema(schema)
    {
        this.attachSchema(schema);
    }

    getLinks()
    {
        return this._links;
    }

    setLinks(links)
    {
        this.addLinks(links);
    }

    setInitialized()
    {
        this._initialized = true;
    }

    isInitialized()
    {
        return this._initialized;
    }

    // getIndexes() {
    //     return [];
    // }

    getName() {
        return this._name;
    }

    getNameNormalized()
    {
        return this.getName().replace('.', '_').toLowerCase();
    }

    // applyHooks()
    // {
    // }

    // createIndexes()
    // {
    //     if(Meteor.isServer)
    //     {
    //         const rawCollection = this.rawCollection();
    //         this.getIndexes().forEach((index) => {
    //             if (_.isObjectNotEmpty(index.fields))
    //             {
    //                 rawCollection.createIndex(
    //                     index.fields,
    //                     index.options
    //                 );
    //             }
    //         });
    //     }
    // }

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
