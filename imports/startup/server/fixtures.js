import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';

import { Article } from '/imports/api/collection/article.js';
import { Type as ArticleType } from '/imports/api/collection/article/type.js';

Meteor.startup(() => {

	if(!ArticleType.find().count())
	{
		console.dir('Creating article types....');

		[
			{
				tagTitle: 'Событие', //TAPi18n.__('article.type.event'),
				sort: 100,
			},
			{
				tagTitle: 'Место', //TAPi18n.__('article.type.place'),
				sort: 200,
			},
			{
				tagTitle: 'Быт', //TAPi18n.__('article.type.life'),
				sort: 300,
			},
		].forEach(item => ArticleType.insert(item));

		console.dir('Done');
	}

});
