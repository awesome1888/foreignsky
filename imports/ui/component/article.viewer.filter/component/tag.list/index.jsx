/* eslint-disable class-methods-use-this */

import React from 'react';
import ArticleTag from '/imports/api/entity/article/tag.js';

import App from '/imports/ui/app.jsx';

//import './style.less';

export default class TagListComponent extends React.Component {

	constructor(params)
	{
		super(params);

		this.state = {
			data: [],
		};
		this.handleTypeClick = this.handleTypeClick.bind(this);
	}

	handleTypeClick(e)
	{
		const typeId = e.target.dataset['id'];
		if(typeId)
		{
			console.dir(typeId);
		}
	}

	componentDidMount()
	{
		this.updateData();
	}

	updateData(params = {})
	{
		return App.instance.setLoading(new Promise((resolve, reject) => {

			ArticleTag.createQuery({
				fields: ['title', 'color'],
				sort: [
					['sort', 'asc']
				]
			}, 'TagListComponent').fetch((err, data) => {
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

	render()
	{
		const data = this.state.data;

		return (
			<div className="article-panel__filter-button-set">
				{data.map(item => {
					return <div
						key={item._id}
						data-id={item._id}
						className={`tag tag__button article-panel__filter-button tag_${item.color ? item.color : 'blue'}`}
						onClick={this.handleTypeClick}
					>
						#{item.title.toLowerCase()}
					</div>;
				})}
			</div>
		);
	}
}