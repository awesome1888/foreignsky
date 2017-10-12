import ArticleMethods from './article/method/method.js';
import ArticleTagMethods from './article.tag/method/method.js';
import EmbedMethods from './embed/method/method.js';
import FileMethods from './file/method/method.js';
import UserMethods from './user/method/method.js';
import UserGroupMethods from './user.group/method/method.js';

// todo: these exposition should be for admin only!
ArticleMethods.declare();
ArticleTagMethods.declare();
EmbedMethods.declare();
FileMethods.declare();
UserMethods.declare();
UserGroupMethods.declare();
