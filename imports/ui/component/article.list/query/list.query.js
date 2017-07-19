import Article from '../../../../api/article/entity/entity.client.js';

export default Article.createQuery({
    select: [
        'title',
    ],
    sort: [
        ['date', 'desc'],
    ],
    limit: 10,
    offset: 0,
    // or
    // page: 1,
    // window: 1,
});
