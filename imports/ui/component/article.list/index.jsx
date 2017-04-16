/* eslint-disable class-methods-use-this */

import React from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';

import Article from '/imports/api/entity/article.js';
import App from '/imports/ui/app.jsx';
import ArticleListFilterComponent from '/imports/ui/component/article.list.filter/index.jsx';
//import PropTypes from 'prop-types';

import './style.less';

export default class ArticleListComponent extends React.Component {

	constructor(params)
	{
		super(params);

		this.state = {
			data: [],
		};
	}

	onFilterChange(params)
	{
		console.dir(params);

		this.updateItemListData(params);
	}

	componentDidMount()
	{
		this.updateItemListData();
	}

	updateItemListData(params = {})
	{
		const filter = {};
		if('tag' in params)
		{
			filter.tagId = params.tag;
		}

		return App.instance.setLoading(new Promise((resolve, reject) => {

			Article.createQuery({
				filter: filter,
				fields: ['title'],
				sort: [
					['date', 'desc'],
				]
			}).fetch((err, data) => {
				this.setState({
					data: data || []
				});

				if(err)
				{
					reject();
				}
				else
				{
					resolve();
				}
			});

		}));
	}

	render(props = {})
	{
		return (
			<div className="article-list">
				<ArticleListFilterComponent
					onChange={this.onFilterChange.bind(this)}
				/>
				<div className="article-list__list">
					<div className="article-list__list-scroll">
						{
							this.state.data.map(item => {
								return (
									<a key={item._id} href={`/${item._id}`} className="article-list__list-item">
										{item.title}
									</a>
								);
							})
						}
					</div>
				</div>
			</div>
		);
	}
}