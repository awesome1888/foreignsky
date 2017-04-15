/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '/imports/ui/page/base/index';

import ArticleViewerFilterComponent from '/imports/ui/component/article.viewer.filter/index.jsx';
import ArticleViewerListComponent from '/imports/ui/component/article.viewer.list/index.jsx';
import ArticleViewerDetailComponent from  '/imports/ui/component/article.viewer.detail/index.jsx';

import App from '/imports/ui/app.jsx';

import './style.less';

export default class HomePage extends BasePage {

	static propTypes = {
	};

	static defaultProps = {
	};

	constructor(params)
	{
		super(params);
		this.state = {};
	}

	getCentralHtml()
	{
		return (
			<div className="home__central">
				<ArticleViewerDetailComponent
					id={this.state.id}
				    app={this.props.app}
				/>
			</div>
		);
	}

	componentWillMount()
	{
		this.handleIdUpdate(this.props.route.id);
	}

	componentWillReceiveProps(next)
	{
		this.handleIdUpdate(next.route.id);
	}

	handleIdUpdate(id)
	{
		if(this.state.id !== id)
		{
			this.setState({id: id});
		}
	}

	getSideHtml()
	{
		return (
			<div className="home__side">
				<ArticleViewerFilterComponent
					app={this.props.app}
				/>
				<ArticleViewerListComponent
					app={this.props.app}
				/>
			</div>
		);
	}
}