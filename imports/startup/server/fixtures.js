import { Meteor } from 'meteor/meteor';
import { Article } from '/imports/api/collection/article.js';
import { Type as ArticleType } from '/imports/api/collection/article/type.js';

Meteor.startup(() => {

	if(!ArticleType.find().count())
	{
		console.dir('Creating article types...');

		[
			{
				tagTitle: 'Событие',
				sort: 100,
			},
			{
				tagTitle: 'Место',
				sort: 200,
			},
			{
				tagTitle: 'Быт',
				sort: 300,
			},
		].forEach(item => ArticleType.insert(item));

		console.dir('Done');
	}

});
