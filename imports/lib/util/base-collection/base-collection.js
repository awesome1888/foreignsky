import {Mongo} from 'meteor/mongo';

export default class BaseCollection extends Mongo.Collection
{
    constructor(collectionName)
    {
        super(collectionName);
        this.attachSchema(this.schema);
        this.addLinks(this.links);
        this.createIndexes();
    }

    get schema()
    {
        throw new Error('Not implemented: get schema()');
    }

    get links()
    {
        return {};
    }

    get indexes() {
        return [];
    }

    createIndexes()
    {
        if(Meteor.isServer)
        {
            const rawCollection = this.rawCollection();
            this.indexes.forEach((index) => {
                rawCollection.createIndex(
                    index.fields,
                    index.options
                );
            });
        }
    }
}
