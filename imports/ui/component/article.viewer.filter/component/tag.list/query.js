import {Tag as ArticleTag} from '/imports/api/collection/article/tag.js';

export default ArticleTag.createQuery({
	tagTitle: 1,
	$options: {
		sort: {
			sort: 1
		}
	}
});