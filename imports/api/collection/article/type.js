import { Mongo } from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

class TypeCollection extends Mongo.Collection
{
	constructor()
	{
		super('article.type');
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

export const Type = new TypeCollection();