/**
 * This file will be auto-generated
 */

import EntityMap from '../../lib/util/entity-map/entity-map.js';

// entity-import-begin
import Article from '../../api/article/entity/entity.client.js';
import ArticleTag from '../../api/article.tag/entity/entity.client.js';
import Embed from '../../api/embed/entity/entity.client.js';
import File from '../../api/file/entity/entity.client.js';
import TestEntity from '../../api/test-entity/entity/entity.client.js';
import TestSubEntity from '../../api/test-linked-entity/entity/entity.client.js';
// entity-import-end

// page-controller-import-begin
import ArticleListPage from '../../ui/page/article-list/index.jsx';
import ArticleDetailPage from '../../ui/page/article-detail/index.jsx';
import ArticleTagListPage from '../../ui/page/article.tag-list/index.jsx';
import EmbedListPage from '../../ui/page/embed-list/index.jsx';
import EmbedDetailPage from '../../ui/page/embed-detail/index.jsx';
import FileListPage from '../../ui/page/file-list/index.jsx';
import FileDetailPage from '../../ui/page/file-detail/index.jsx';
import TestEntityListPage from '../../ui/page/test-entity-list/index.jsx';
import TestEntityDetailPage from '../../ui/page/test-entity-detail/index.jsx';
import TestSubEntityListPage from '../../ui/page/test-sub-entity-list/index.jsx';
import TestSubEntityDetailPage from '../../ui/page/test-sub-entity-detail/index.jsx';
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
                        controller: ArticleDetailPage,
                    },
                },
                entity: Article,
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
                entity: ArticleTag,
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
                        controller: EmbedDetailPage,
                    },
                },
                entity: Embed,
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
                        controller: FileDetailPage,
                    },
                },
                entity: File,
                title: File.getTitle(),
            },
            {
                route: {
                    list: {
                        path: '/entity/test-entity/',
                        controller: TestEntityListPage,
                    },
                    detail: {
                        path: '/entity/test-entity/#ID#/',
                        controller: TestEntityDetailPage,
                    },
                },
                entity: TestEntity,
                title: TestEntity.getTitle(),
            },
            {
                route: {
                    list: {
                        path: '/entity/test-sub-entity/',
                        controller: TestSubEntityListPage,
                    },
                    detail: {
                        path: '/entity/test-sub-entity/#ID#/',
                        controller: TestSubEntityDetailPage,
                    },
                },
                entity: TestSubEntity,
                title: TestSubEntity.getTitle(),
            },
            // route-declaration-end
        ]);
    }
}

export default new AdminEntityMap();
