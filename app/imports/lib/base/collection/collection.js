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

        this.createIndexes();
        this.applyHooks();

        if (Meteor.isDevelopment && Meteor.isClient)
        {
            window.__collections = window.__collections || {};
            window.__collections[this.getName()] = this;
        }
    }

    getIndexes()
    {
        return [
            // {
            //     fields: {
            //         search: "text",
            //     },
            //     options: {
            //         name: 'search',
            //     },
            // }
        ];
    }

    initialize(map)
    {
        if (this.isInitialized())
        {
            throw new Error('The collection was already initialized');
        }

        const collection = this.getCollection();

        collection.attachSchema(map.getSchema());
        collection.addLinks(map.getLinks());

        this.setInitialized();
    }

    /**
     * This will apply low-level hooks on the collection
     */
    applyHooks()
    {
        // this.getCollection().before.insert((id, data) => {
        // });
        // this.getCollection().before.update((id, data, fieldNames, modifier) => {
        // });
    }

    createIndexes()
    {
        if (Meteor.isServer)
        {
            const rc = this.getRawCollection();
            this.getIndexes().forEach((index) => {
                if (_.isObject(index.fields) && Object.keys(index.fields).length)
                {
                    const options = index.options || {};
                    if (!_.isStringNotEmpty(options))
                    {
                        options.name = this.makeIndexName(index);
                    }

                    rc.createIndex(
                        index.fields,
                        options,
                    );
                }
            });
        }
    }

    makeIndexName(index) {
        const name = [];
        _.forEach(index.fields, (way, field) => {
            name.push(`${field}_${way}`);
        });

        return name.join('_');
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

    getName()
    {
        return this.getCollection()._name;
    }

    getNameNormalized()
    {
        // todo: probably stick to the camel-case here
        return this.getName().replace(/[\.-]+/g, '');
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

    getMongoCollection()
    {
        return this._collection;
    }

    /**
     * @deprecated
     * @returns {*}
     */
    getCollection()
    {
        return this._collection;
    }

    /** Forwarded method calls below */

    batchInsert(...args)
    {
        return this.getCollection().batchInsert(...args);
    }

    /**
     * for grapher, temporal
     * @returns {*}
     */
    createQuery(...args)
    {
        return this.getCollection().createQuery(...args);
    }

    insert(...args)
    {
        return this.getCollection().insert(...args);
    }

    update(...args)
    {
        return this.getCollection().update(...args);
    }

    remove(...args)
    {
        return this.getCollection().remove(...args);
    }

    find(...args)
    {
        return this.getCollection().find(...args);
    }

    findOne(...args)
    {
        return this.getCollection().findOne(...args);
    }

    deny(...args)
    {
        return this.getMongoCollection().deny(...args);
    }

    // allow(...args)
    // {
    //     return this.getMongoCollection().allow(...args);
    // }

    async truncate()
    {
        if (Meteor.isServer)
        {
            const rc = this.getRawCollection();
            return rc.drop().then(() => {
                return rc.insert({foo: 'bar'});
            }).then(() => {
                this.createIndexes();
                return rc.deleteMany({});
            });
        }
        else
        {
            return true;
        }
    }
}
