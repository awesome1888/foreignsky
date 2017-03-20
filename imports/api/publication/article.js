import { Meteor } from 'meteor/meteor';
import { Article } from '/imports/api/collection/article.js';

Meteor.publish('article.list', function () {
  return Article.find();
});
