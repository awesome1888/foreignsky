/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';
import MapFullLayout from '../../component/layout/map-full/map-full.jsx';

import ArticleListComponent from '/imports/ui/component/article.list/index.jsx';
import ArticleDetailComponent from  '/imports/ui/component/article.detail/index.jsx';

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

	render()
    {
        return (
            <MapFullLayout
                className="margin-top_5"
                side={
                    <ArticleListComponent />
                }
                central={
                    <ArticleDetailComponent
                        id={this.state.id}
                    />
                }
            />
        );
    }
}
