import route from '../../../../imports/ui/router.js';

import HomePage from '../../../ui/page/home/index.jsx';
import ArticleTagList from '../../../ui/page/article.tag-list/index.jsx';
import ArticleList from '../../../ui/page/article-list/index.jsx';
import EmbedList from '../../../ui/page/embed-list/index.jsx';
import ShellPage from '../../../ui/page/shell/index.jsx';
import NotFoundPage from '../../../ui/page/404/index.jsx';

FlowRouter.notFound = {
    action: function() {
        FlowRouter.go('/404');
    }
};

// route('/shell', ShellPage, {});
// route('/', HomePage, {});
route('/404', NotFoundPage, {});
route('/shell', ShellPage, {});
route('/article.tag/list', ArticleTagList, {});
route('/article/list', ArticleList, {});
route('/embed/list', EmbedList, {});
route('/', HomePage, {});
