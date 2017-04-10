import route from '/imports/ui/router.js';

// import ListPage from '/imports/ui/pages/list.jsx';
// import LoginPage from '/imports/ui/pages/login.jsx';
// import RegisterPage from '/imports/ui/pages/register.jsx';
// import LogoutPage from '/imports/ui/pages/logout.jsx';

import HomePage from '/imports/ui/page/home/index.jsx';
import NotFoundPage from '/imports/ui/page/not-found/index.jsx';

// FlowRouter.route('/', {
// 	action() {
// 		FlowRouter.go('/list');
// 	}
// });

FlowRouter.notFound = {
	action: function() {
		FlowRouter.go('/not-found');
	}
};

route('/', HomePage, {});
route('/:id', HomePage, {});
route('/not-found', NotFoundPage, {});