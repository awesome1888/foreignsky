/* eslint-disable class-methods-use-this */

import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { TAPi18n } from 'meteor/tap:i18n';

import ArticleTag from '/imports/api/entity/article/tag.js';

import './style.less';

import App from '/imports/ui/app.jsx';

export default class ArticleViewerFilterComponent extends React.Component {

	constructor(params)
	{
		super(params);

		this.handleTypeClick = this.handleTypeClick.bind(this);

		this.state = {
			tags: [],
		};
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
					tags: data || []
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
		const tags = this.state.tags;

		return (
			<div className="article-panel__filter">
				<div className="article-panel__filter-search">
				    <input className="input article-panel__filter-input" type="text" placeholder="Искать статью" />
				</div>
				<div className="article-panel__filter-button-set">
					{tags.map(item => {
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
			</div>
		);
	}
}