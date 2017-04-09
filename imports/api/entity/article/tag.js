import BaseEntity from './../base.js';
import ArticleTagCollection from '../../collection/article/tag.js';

class ArticleTag extends BaseEntity
{
	get collectionClass()
	{
		return ArticleTagCollection;
	}
}

export {ArticleTag};
export default new ArticleTag();