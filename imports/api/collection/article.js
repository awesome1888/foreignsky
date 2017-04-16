import { Mongo } from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import ArticleTagCollection from '/imports/api/collection/article/tag.js'

export default class ArticleCollection extends Mongo.Collection
{
	constructor()
	{
		super('article');
		this.attachSchema(this.schema);
		this.addLinks(this.links);
	}

	insert(data, cb)
	{
		if(!data.date)
		{
			data.date = new Date();
		}

		let tags = null;
		if('tagId' in data)
		{
			tags = data.tagId;
			delete(data.tagId);
		}

		let _id = super.insert(data, cb);

		if(_id && tags)
		{
			let tagLink = this.getLink(_id, 'tag');
			_.map(tags, (tag) => {
				tagLink.add(tag);
			});
		}

		return _id;
	}

	get schema()
	{
		if(!this._schema)
		{
			this._schema = new SimpleSchema({
				_id: {
					type: String,
					regEx: SimpleSchema.RegEx.Id,
					optional: false,
				},
				title: {
					type: String,
					optional: false,
				},
				date: {
					type: Date,
					optional: false,
				},
				text: {
					type: String,
					optional: false,
				},
				tagId: {
					type: [String],
					optional: true,
				},
				location: {
					type: [Number],
					optional: true,
				},
				//headerImage: ,
				headerColor: {
					type: String,
					optional: true,
					regEx: /^[a-z0-9_-]+$/,
				}
			});
		}

		return this._schema;
	}

	get links()
	{
		if(!this._links)
		{
			this._links = {
				tag: {
					type: 'many',
					collection: ArticleTagCollection.getInstance(),
					field: 'tagId',
					index: true,
				}
			};
		}

		return this._links;
	}

	static getInstance()
	{
		if(!this.instance)
		{
			this.instance = new this();
		}

		return this.instance;
	}
}