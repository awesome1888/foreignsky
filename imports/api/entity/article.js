import BaseEntity from './base.js';
import ArticleCollection from '../collection/article.js';

class ArticleEntity extends BaseEntity
{
	get collectionClass()
	{
		return ArticleCollection;
	}
}

export {ArticleEntity};
export default ArticleEntity.getInstance();