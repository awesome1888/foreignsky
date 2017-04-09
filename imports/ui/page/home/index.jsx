/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '/imports/ui/page/base/index';

import ArticleViewerFilterComponent from '/imports/ui/component/article.viewer.filter/index.jsx';
import ArticleViewerListComponent from '/imports/ui/component/article.viewer.list/index.jsx';
import ArticleViewerDetailComponent from  '/imports/ui/component/article.viewer.detail/index.jsx';

import './style.less';

export default class HomePage extends BasePage {

	getCentralHtml()
	{
		return (
			<div className="home__central">
				<ArticleViewerDetailComponent />
			</div>
		);
	}

	getSideHtml()
	{
		return (
			<div className="home__side">
				<ArticleViewerFilterComponent />
				<ArticleViewerListComponent />
			</div>
		);
	}
}