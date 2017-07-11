import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export default class BaseCollection extends Mongo.Collection
{
    constructor(collectionName)
    {
        super(collectionName);
        this.attachSchema(this.schema);
        this.addLinks(this.links);
        // this.ensureIndexesExist();
    }

    get schema()
    {
        throw new Error('Not implemented');
    }

    get links()
    {
        return {};
    }

    ensureIndexesExist()
    {
    }

    // ensureIndexesExist()
    // {
    //     if(Meteor.isServer)
    //     {
    //         this.rawCollection().createIndex({
    //             search: "text",
    //         }, {
    //             name: 'search',
    //         });
    //     }
    // }
}