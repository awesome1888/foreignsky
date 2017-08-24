// import Article from './article/entity/entity.server.js';
import ArticleTagMethods from './article.tag/method/method.js';
import EmbedMethods from './embed/method/method.js';
import FileMethods from './file/method/method.js';
import TestEntity from './test-entity/method/method.js';
import TestSubEntity from './test-linked-entity/method/method.js';

// todo: these exposition should be for admin only!
// Article.expose();
ArticleTagMethods.declare();
EmbedMethods.declare();
FileMethods.declare();
TestEntity.declare();
TestSubEntity.declare();
