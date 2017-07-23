import Article from './article/entity/entity.server.js';
import ArticleTag from './article.tag/entity/entity.server.js';

Article.exposeGrapher();
ArticleTag.exposeGrapher();

Article.expose();
ArticleTag.expose();
