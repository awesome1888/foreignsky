import Article from '../../../imports/api/article/entity/entity.server.js';

export default class SiteMapGenerator
{
    static generate()
    {
        const pages = Article.find({
            filter: {
                public: true,
            },
            select: {
                title: 1,
                date: 1,
            },
        }).reduce((pageList, article) => {

            pageList.push({
                page: '/'+article.getId(),
                lastmod: article.getDate(),
            });
            return pageList;

        }, []);

        pages.unshift({
            page: '/'
        });

        return pages;
    }
}

// { page: '/pageWithViedeoAndImages',
//     lastmod: new Date().getTime(),
//     changefreq: 'monthly',
//     priority: 0.8,
//     images: [
//         { loc: '/myImg.jpg', },        // Only loc is required
//         { loc: '/myOtherImg.jpg',      // Below properties are optional
//             caption: "..", geo_location: "..", title: "..", license: ".."}
//     ],
//     videos: [
//         { loc: '/myVideo.jpg', },      // Only loc is required
//         { loc: '/myOtherVideo.jpg',    // Below properties are optional
//             thumbnail_loc: "..", title: "..", description: ".." etc }
//     ],
//     xhtmlLinks: [
//         { rel: 'alternate', hreflang: 'de', href: '/lang/deutsch' },
//         { rel: 'alternate', hreflang: 'de-ch', href: '/lang/schweiz-deutsch' },
//         { rel: 'alternate', hreflang: 'en', href: '/lang/english' }
//     ]
// },