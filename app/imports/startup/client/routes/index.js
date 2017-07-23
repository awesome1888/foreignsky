import route from '/imports/ui/router.js';

import HomePage from '/imports/ui/page/home/index.jsx';
import ShellPage from '/imports/ui/page/shell/index.jsx';
import NotFoundPage from '/imports/ui/page/not-found/index.jsx';

FlowRouter.notFound = {
	action: function() {
		FlowRouter.go('/404');
	}
};

route('/shell', ShellPage, {});
route('/', HomePage, {});
route('/404', NotFoundPage, {});
route('/:id', HomePage, {});