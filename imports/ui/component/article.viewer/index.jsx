/* eslint-disable class-methods-use-this */

import React from 'react';
import ArticleViewerFilter from '/imports/ui/component/article.viewer.filter/index.jsx';
import ArticleViewerList from '/imports/ui/component/article.viewer.list/index.jsx';
import ArticleViewerDetail from  '/imports/ui/component/article.viewer.detail/index.jsx';

import './style.less';

export default class ArticleViewer extends React.Component {
	render(props = {})
	{
		props.containerElementProps = props.containerElementProps || {};
		props.markers = props.markers || [];

		return (
			<div>
				<div className="article-panel">
					<ArticleViewerFilter />
					<ArticleViewerList />
				</div>
				<ArticleViewerDetail />
			</div>
		);
	}
}