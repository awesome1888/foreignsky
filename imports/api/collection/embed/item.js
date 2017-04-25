import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import BaseCollection from './../base.js';
import FileCollection from './../file.js';

export default class EmbedItemCollection extends BaseCollection
{
	constructor()
	{
		super('embed.item');
	}

	describeSchema()
	{
		return {
			_id: {
				type: String,
				regEx: SimpleSchema.RegEx.Id,
				optional: false,
			},
			imageId: {
				type: String,
				optional: false,
			},
			label: {
				type: String,
				optional: true,
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
			image: {
				type: 'one',
				collection: FileCollection.getInstance(),
				field: 'imageId',
				index: true,
			}
		};
	}
}