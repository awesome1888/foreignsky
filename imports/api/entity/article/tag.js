import BaseEntity from './../base.js';
import ArticleTagCollection from '../../collection/article/tag.js';

class ArticleTag extends BaseEntity
{
	get collectionClass()
	{
		return ArticleTagCollection;
	}

	// server code
    static getByTitle(titles)
    {
	    if (_.isStringNotEmpty(titles))
        {
            titles = [titles];
        }

        const result = [];

	    if(_.isArray(titles))
        {
            titles = titles
                .filter(item => _.isStringNotEmpty(item))
                .map(item => item.trim().toUpperCase())
                .filter(item => _.isStringNotEmpty(item));
            
            ArticleTagCollection.instance.find({
                search: {$in: titles}
            }).forEach((item) => {
                result.push(item);
            });
        }

	    return result;
    }
}

export {ArticleTag};
export default ArticleTag.getInstance();