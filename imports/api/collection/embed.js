import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import BaseCollection from './base.js';
import EmbedItemCollection from './embed/item.js';

export default class EmbedCollection extends BaseCollection
{
	constructor()
	{
		super('embed');
	}

	describeSchema()
	{
		return {
			_id: {
				type: String,
				regEx: SimpleSchema.RegEx.Id,
				optional: false,
			},
			itemId: {
				type: [String],
				optional: true,
			},
			renderer: {
				type: String,
				optional: false,
			},
			options: {
				type: Object,
				optional: true,
			},
		};
	}

	describeLinks()
	{
		return {
			item: {
				type: 'many',
				collection: EmbedItemCollection.getInstance(),
				field: 'itemId',
				index: true,
			},
		};
	}
}