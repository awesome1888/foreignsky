import {Article} from '/imports/api/collection/article.js';

Meteor.methods({
	'article.find'()
	{
		return 100;

		let res = Article.find({}, {title: 1});

		console.dir(res);

		return res.fetch();
	}
});