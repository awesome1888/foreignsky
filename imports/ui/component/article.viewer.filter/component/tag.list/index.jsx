/* eslint-disable class-methods-use-this */

import React from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import ArticleTag from '/imports/api/entity/article/tag.js';

//import './style.less';

class TagListComponent extends React.Component {

	constructor(params)
	{
		super(params);

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

	render()
	{
		let {data, loading} = this.props;
		data = data || [];

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

export default createQueryContainer(ArticleTag.createQuery({
	fields: ['title', 'color'],
	sort: [
		['sort', 'asc']
	]
}, 'TagListComponent'), TagListComponent, {
	reactive: false,
	single: false,
});