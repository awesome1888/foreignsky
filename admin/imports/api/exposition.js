import Article from './article/entity/entity.server.js';
import ArticleTag from './article.tag/entity/entity.server.js';
import Embed from './embed/entity/entity.server.js';
import File from './file/entity/entity.server.js';

// todo: exposition should be for admin only!
Article.expose();
ArticleTag.expose();
Embed.expose();
File.expose();
