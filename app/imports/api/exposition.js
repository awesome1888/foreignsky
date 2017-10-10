import Article from './article/entity/entity.server.js';
import ArticleTag from './article.tag/entity/entity.server.js';

Article.expose();
ArticleTag.expose();

// deprecated, used only to make client-side queries, which is obsolete now
Article.exposeGrapher();
ArticleTag.exposeGrapher();
