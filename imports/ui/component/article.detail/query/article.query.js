import Article from '../../../../api/article/entity/entity.client.js';

export default Article.collection.createQuery({
    $filter({ filters, params }) {
        if ('id' in params) {
            filters._id = params.id;
        }
        if ('public' in params) {
            filters.public = !!params.public;
        }
    },
    title: 1,
    text: 1,
    date: 1,
    headerColor: 1,
    headerImage: {
        title: 1,
        path: 1,
    },
    tag: {
        title: 1,
        color: 1,
    },
    embed: {
        item: {
            image: {
                title: 1,
                path: 1,
            },
            label: 1,
            options: 1,
        },
        renderer: 1,
        options: 1,
    },
});
