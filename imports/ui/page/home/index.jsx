/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '/imports/ui/page/base/index';

import ArticleViewerFilter from '/imports/ui/component/article.viewer.filter/index.jsx';
import ArticleViewerList from '/imports/ui/component/article.viewer.list/index.jsx';
import ArticleViewerDetail from  '/imports/ui/component/article.viewer.detail/index.jsx';

import './style.less';

export default class HomePage extends BasePage {

	getCentralHtml()
	{
		return (
			<div className="home__central">
				<ArticleViewerDetail />
			</div>
		);
	}

	getSideHtml()
	{
		return (
			<div className="home__side">
				<ArticleViewerFilter />
				<ArticleViewerList />
			</div>
		);
	}
}