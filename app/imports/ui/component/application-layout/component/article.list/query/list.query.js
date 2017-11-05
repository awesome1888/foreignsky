import Article from '../../../../../../api/article/entity/entity.client.js';

export default Article.createQuery({
    select: [
        'title',
    ],
    sort: [
        ['date', 'desc'],
    ],
});
