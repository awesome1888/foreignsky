/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '/imports/ui/page/base/index';

import ArticleListComponent from '/imports/ui/component/article.list/index.jsx';
import ArticleDetailComponent from  '/imports/ui/component/article.detail/index.jsx';

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
				<ArticleListComponent
					app={this.props.app}
				/>
			</div>
		);
	}

	getCentralHtml()
	{
		return (
			<div className="home__central">
				<ArticleDetailComponent
					id={this.state.id}
					app={this.props.app}
				/>
			</div>
		);
	}
}