import ArticleMethods from './article/method.js';
import ArticleTagMethods from './article.tag/method.js';
import EmbedMethods from './embed/method.js';
import FileMethods from './file/method.js';
import UserMethods from './user/method.js';
import UserGroupMethods from './user.group/method.js';

import {provider} from './security-provider.js';

ArticleMethods.declare(provider);
ArticleTagMethods.declare(provider);
EmbedMethods.declare(provider);
FileMethods.declare(provider);
UserMethods.declare(provider);
UserGroupMethods.declare(provider);
