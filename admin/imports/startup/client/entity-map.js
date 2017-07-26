/**
 * This file will be auto-generated
 */

import EntityMap from '../../lib/util/entity-map/entity-map.js';

// entity-import-begin
import Article from '../../api/article/entity/entity.client.js';
import ArticleTag from '../../api/article.tag/entity/entity.client.js';
import Embed from '../../api/embed/entity/entity.client.js';
import File from '../../api/file/entity/entity.client.js';
// entity-import-end

// page-controller-import-begin
import ArticleTagListPage from '../../ui/page/article.tag-list/index.jsx';
import ArticleListPage from '../../ui/page/article-list/index.jsx';
import EmbedListPage from '../../ui/page/embed-list/index.jsx';
import FileListPage from '../../ui/page/file-list/index.jsx';
// page-controller-import-end

class AdminEntityMap extends EntityMap
{
    constructor()
    {
        super([
            // route-declaration-begin
            {
                route: {
                    list: {
                        path: '/entity/article/',
                        controller: ArticleListPage,
                    },
                    detail: {
                        path: '/entity/article/#ID#/',
                        controller: null, // fix later
                    },
                },
                title: Article.getTitle(),
            },
            {
                route: {
                    list: {
                        path: '/entity/article.tag/',
                        controller: ArticleTagListPage,
                    },
                    detail: {
                        path: '/entity/article.tag/#ID#/',
                        controller: null, // fix later
                    },
                },
                title: ArticleTag.getTitle(),
            },
            {
                route: {
                    list: {
                        path: '/entity/embed/',
                        controller: EmbedListPage,
                    },
                    detail: {
                        path: '/entity/embed/#ID#/',
                        controller: null, // fix later
                    },
                },
                title: Embed.getTitle(),
            },
            {
                route: {
                    list: {
                        path: '/entity/file/',
                        controller: FileListPage,
                    },
                    detail: {
                        path: '/entity/file/#ID#/',
                        controller: null, // fix later
                    },
                },
                title: File.getTitle(),
            },
            // route-declaration-end
        ]);
    }
}

export default new AdminEntityMap();