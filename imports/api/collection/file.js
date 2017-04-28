import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import BaseCollection from '/imports/api/collection/base.js';

export default class FileCollection extends BaseCollection
{
	constructor()
	{
		super('file');
	}

	describeSchema()
	{
		return {
			_id: {
				type: String,
				regEx: SimpleSchema.RegEx.Id,
				optional: false,
			},
			title: {
				type: String,
				optional: false,
			},
			url: {
				type: String,
				optional: true,
			},
		};
	}
}