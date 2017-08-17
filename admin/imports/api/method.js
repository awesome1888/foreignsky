// import Article from './article/entity/entity.server.js';
// import ArticleTag from './article.tag/entity/entity.server.js';
// import Embed from './embed/entity/entity.server.js';
// import File from './file/entity/entity.server.js';
import TestEntity from './test-entity/method/method.js';
import TestSubEntity from './test-linked-entity/method/method.js';

// todo: these exposition should be for admin only!
// Article.expose();
// ArticleTag.expose();
// Embed.expose();
// File.expose();
TestEntity.declare();
TestSubEntity.declare();

