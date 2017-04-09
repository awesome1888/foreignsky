/* eslint-disable class-methods-use-this */

import React from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import Article from '/imports/api/entity/article.js';

import './style.less';

class ArticleViewerListComponent extends React.Component {

	constructor(params)
	{
		super(params);

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

	render(props = {})
	{
		let {data, loading} = this.props;
		data = data || [];

		return (
			<div className="article-panel__list">
				<div className="article-panel__list-scroll">
					{
						data.map(item => {
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

export default createQueryContainer(Article.createQuery({
	fields: ['title'],
	sort: [
		['date', 'desc'],
	]
}, 'ArticleViewerListComponent'), ArticleViewerListComponent, {
	reactive: false,
	single: false,
});