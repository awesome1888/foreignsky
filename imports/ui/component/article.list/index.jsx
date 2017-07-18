/* eslint-disable class-methods-use-this */

import React from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';

import Article from '/imports/api/article/entity/entity.client.js';
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
		this.updateItemListData(params);
	}

	componentDidMount()
	{
		this.updateItemListData();
	}

	updateItemListData(params = {})
	{
		const filter = {
			public: true,
		};
		if('tag' in params)
		{
			filter.tagId = params.tag;
		}
		if('text' in params && _.isString(params.text))
		{
			params.text = params.text.trim().toUpperCase();
			if(params.text)
			{
				filter.$text = {
					$search: params.text,
					//$diacriticSensitive: false,
					//$caseSensitive: true,
				};
			}
		}

		return App.instance.setLoading(new Promise((resolve, reject) => {
		    // low-level, just for now
			Article.collection.createQuery({
				$filters: filter,
				title: 1,
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

	hasData() {
	    return _.isArrayNotEmpty(this.state.data);
    }

	render(props = {})
	{
	    const data = this.state.data;

		return (
			<div className="article-list">
				<ArticleListFilterComponent
					onChange={this.onFilterChange.bind(this)}
				/>
				<div className="article-list__list">
					<div className="article-list__list-scroll">
                        {
                            !this.hasData()
                            &&
                            <div className="text_size_minor">
                                Нет статей для показа. Плак :'(
                            </div>
                        }
						{
                            this.hasData()
                            &&
                            data.map(item => {
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