import {Tag as ArticleTag} from '/imports/api/collection/article/tag.js';

export const BaseTags = ArticleTag.createQuery({
	tagTitle: 1,
	$options: {
		sort: {
			sort: 1
		}
	}
});