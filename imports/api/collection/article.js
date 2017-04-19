import { Mongo } from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import ArticleTagCollection from '/imports/api/collection/article/tag.js'
import FileCollection from '/imports/api/collection/file.js'

export default class ArticleCollection extends Mongo.Collection
{
	constructor()
	{
		super('article');
		this.attachSchema(this.schema);
		this.addLinks(this.links);
		this.ensureIndexesExist();
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

		let headerImage = null;
		if('headerImage' in data)
		{
			headerImage = data.headerImage;
			delete(data.headerImage);
		}

		data.search = '';
		if(_.isString(data.title))
		{
			data.search += data.title.toUpperCase();
		}
		if(_.isString(data.text))
		{
			// todo: also remove possible special constructions
			data.search += ' '+data.text.toUpperCase();
		}

		let _id = super.insert(data, cb);

		if(_id && tags)
		{
			let tagLink = this.getLink(_id, 'tag');
			_.map(tags, (tag) => {
				tagLink.add(tag);
			});
		}

		if(_id && headerImage)
		{
			let headerImageLink = this.getLink(_id, 'headerImage');
			headerImageLink.set(headerImage);
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
				headerImageId: {
					type: [String],
					optional: true,
				},
				headerColor: {
					type: String,
					optional: true,
					regEx: /^[a-z0-9_-]+$/,
				},
				search: {
					type: String,
					optional: false,
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
				},
				headerImage: {
					type: 'one',
					collection: FileCollection.getInstance(),
					field: 'headerImageId',
					index: false,
				}
			};
		}

		return this._links;
	}

	ensureIndexesExist()
	{
		if(Meteor.isServer)
		{
			this.rawCollection().createIndex({
				search: "text",
			}, {
				name: 'search',
			});
		}
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