import Article from '../../../imports/api/entity/article.js';

export default class SiteMapGenerator
{
    static generate()
    {
        const pages = Article.find({
            filter: {
                public: true,
            },
            fields: {
                _id: 1,
                title: 1,
                date: 1,
            },
        }).reduce((pageList, article) => {

            pageList.push({
                page: '/'+article._id,
                lastmod: article.date,
            });
            return pageList;

        }, []);

        pages.unshift({
            page: '/'
        });

        return pages;
    }
}
