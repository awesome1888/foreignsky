import ArticleMethods from './article/method/method.js';
import ArticleTagMethods from './article.tag/method/method.js';
import EmbedMethods from './embed/method/method.js';
import FileMethods from './file/method/method.js';

import SecurityProvider from '../exposition/security-provider.js';

const provider = new SecurityProvider();

ArticleMethods.declare(provider);
ArticleTagMethods.declare(provider);
EmbedMethods.declare(provider);
FileMethods.declare(provider);
