// import Article from './article/entity/entity.server.js';
// import ArticleTag from './article.tag/entity/entity.server.js';
// import Embed from './embed/entity/entity.server.js';
import File from './file/method/method.js';
import TestEntity from './test-entity/method/method.js';
import TestSubEntity from './test-linked-entity/method/method.js';

// todo: these exposition should be for admin only!
// Article.expose();
// ArticleTag.expose();
// Embed.expose();
File.declare();
TestEntity.declare();
TestSubEntity.declare();
