/* eslint-disable class-methods-use-this */

import React from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';

import Query from './query.js';

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
						className="tag tag__seagreen tag__button article-panel__filter-button"
						onClick={this.handleTypeClick}
					>
						#{item.tagTitle}
					</div>;
				})}
			</div>
		);
	}
}

const Tasks = function(data){

	console.dir(data);

	const {data1, loading, error, pool} = this.props;

	console.dir(data1);

	return (
		<div className="">
			_.map(data.data, task => <div>{task.title}</div>)
		</div>
	);
};

export default createQueryContainer(Query, TagListComponent, {
	// reactive: false,
	// single: false,

	reactive: true, // defaults to false, will use pub/sub system
	single: false, // defaults to false, when you expect a single document, like you filter by _id, use this.
});