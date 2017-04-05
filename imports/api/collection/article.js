import { Mongo } from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import {Tag as ArticleTag} from '/imports/api/collection/article/tag.js'

class ArticleCollection extends Mongo.Collection
{
	constructor()
	{
		super('article');
		this.attachSchema(this.schema);
		this.addLinks({
			tag: {
				type: 'many',
				collection: ArticleTag,
				field: 'tagId',
				index: true,
			}
		});
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
		return new SimpleSchema({
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
			html: {
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

			// todo: + Link to Type via grapher
		});
	}
}

export const Article = new ArticleCollection();