import {Mongo} from 'meteor/mongo';
import BulkContext from './bulk-context/bulk-context.js';

export default class BaseCollection extends Mongo.Collection
{
    constructor(collectionName)
    {
        super(collectionName);
        this.attachSchema(this.getSchema());
        this.addLinks(this.getLinks());
        this.createIndexes();
        this.applyHooks();
    }

    getSchema()
    {
        throw new Error('Not implemented: getSchema()');
    }

    getLinks()
    {
        return {};
    }

    getIndexes() {
        return [];
    }

    getName() {
        return this._name;
    }

    getNameNormalized()
    {
        return this.getName().replace('.', '_').toLowerCase();
    }

    applyHooks()
    {
    }

    createIndexes()
    {
        if(Meteor.isServer)
        {
            const rawCollection = this.rawCollection();
            this.getIndexes().forEach((index) => {
                rawCollection.createIndex(
                    index.fields,
                    index.options
                );
            });
        }
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
