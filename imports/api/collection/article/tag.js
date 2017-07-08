import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import BaseCollection from '/imports/api/collection/base.js';

export default class ArticleTagCollection extends BaseCollection
{
	constructor()
	{
		super('article.tag');
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
			sort: {
				type: Number,
				optional: true,
			},
			color: {
				type: String,
				optional: true,
				regEx: /^[a-z0-9_-]+$/,
			},
			primary: {
				type: Boolean,
				optional: true,
			},
            search: {
                type: String,
                optional: true,
            },
		};
	}
}
