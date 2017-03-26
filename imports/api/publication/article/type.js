import { Meteor } from 'meteor/meteor';
import { Type as ArticleType } from '/imports/api/collection/article/type.js';

Meteor.publish('article.type.list', function () {
	return ArticleType.find();
});