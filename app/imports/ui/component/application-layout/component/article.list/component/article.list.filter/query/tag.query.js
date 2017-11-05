import ArticleTag from '../../../../../../../../api/article.tag/entity/entity.client.js';

export default ArticleTag.createQuery({
    filter: {
        primary: true,
    },
    select: [
        'title',
        'color'
    ],
    sort: [
        ['sort', 'asc']
    ],
    limit: 3,
});
