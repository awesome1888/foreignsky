import { Mongo } from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

class TagCollection extends Mongo.Collection
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
			tagTitle: {
				type: String,
				optional: false,
			},
			sort: {
				type: Number,
				optional: true,
			}
		});
	}
}

export const Tag = new TagCollection();