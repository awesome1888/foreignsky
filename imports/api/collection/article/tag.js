import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export default class ArticleTagCollection extends Mongo.Collection
{
	constructor()
	{
		super('article.tag');
		this.attachSchema(this.schema);
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
			sort: {
				type: Number,
				optional: true,
			}
		});
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