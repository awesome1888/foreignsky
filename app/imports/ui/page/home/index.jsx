/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import ArticleDetailComponent from  './component/article.detail/index.jsx';

export default class HomePage extends BasePage
{
	constructor(params)
	{
		super(params);
		this.extendState({
            id: null,
        });
	}

	componentWillMount()
	{
        super.componentWillMount();

		this.handleIdUpdate(this.props.route.id);
	}

	componentWillReceiveProps(next)
	{
		this.handleIdUpdate(next.route.id);
	}

    getPageTitle()
    {
        return 'Home';
    }

	handleIdUpdate(id)
	{
		if(this.state.id !== id)
		{
            this.setState({id: id});

		    if (!_.isStringNotEmpty(id))
            {
		        this.setTitle(this.getPageTitle());
            }
		}
	}

	render()
    {
        return (
            <ArticleDetailComponent
                id={this.state.id}
            />
        );
    }
}
