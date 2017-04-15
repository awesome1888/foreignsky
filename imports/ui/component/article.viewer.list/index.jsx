/* eslint-disable class-methods-use-this */

import React from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import Article from '/imports/api/entity/article.js';

import App from '/imports/ui/app.jsx';

import './style.less';

export default class ArticleViewerListComponent extends React.Component {

	constructor(params)
	{
		super(params);

		this.state = {
			data: [],
		};

		//this.handleTypeClick = this.handleTypeClick.bind(this);
	}

	// handleTypeClick(e)
	// {
	// 	const typeId = e.target.dataset['id'];
	// 	if(typeId)
	// 	{
	// 		console.dir(typeId);
	// 	}
	// }

	componentDidMount()
	{
		this.updateData();
	}

	updateData(params = {})
	{
		return App.instance.setLoading(new Promise((resolve, reject) => {

			Article.createQuery({
				fields: ['title'],
				sort: [
					['date', 'desc'],
				]
			}, 'ArticleViewerListComponent').fetch((err, data) => {
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
			<div className="article-panel__list">
				<div className="article-panel__list-scroll">
					{
						this.state.data.map(item => {
							return (
								<a key={item._id} href={`/${item._id}`} className="article-panel__list-item">
									{item.title}
								</a>
							);
						})
					}
				</div>
			</div>
		);
	}
}