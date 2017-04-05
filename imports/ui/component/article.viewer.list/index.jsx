/* eslint-disable class-methods-use-this */

import { Meteor } from 'meteor/meteor';
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import {Article} from '/imports/api/collection/article.js';

import './style.less';

class ArticleViewerList extends React.Component {

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

	getData()
	{
		let res = Meteor.apply('article.find');
		console.dir(res);
	}

	render(props = {})
	{
		//const {loading, items} = this.props;

		this.getData();

		return (
			<div className="article-panel__list">
				<div className="article-panel__list-scroll">
						<a href="/100" className="article-panel__list-item">
							Про парковку
						</a>
						<a href="/200" className="article-panel__list-item">
							Про наклейку на лобовое стекло машины
						</a>
						<a href="/200" className="article-panel__list-item">
							Воскресенье в Германии
						</a>
						<a href="/100" className="article-panel__list-item">
							Про парковку
						</a>
						<a href="/200" className="article-panel__list-item">
							Про наклейку на лобовое стекло машины
						</a>
						<a href="/200" className="article-panel__list-item">
							Воскресенье в Германии
						</a>
						<a href="/100" className="article-panel__list-item">
							Про парковку
						</a>
						<a href="/200" className="article-panel__list-item">
							Про наклейку на лобовое стекло машины
						</a>
						<a href="/200" className="article-panel__list-item">
							Воскресенье в Германии
						</a>
						<a href="/100" className="article-panel__list-item">
							Про парковку
						</a>
						<a href="/200" className="article-panel__list-item">
							Про наклейку на лобовое стекло машины
						</a>
						<a href="/200" className="article-panel__list-item">
							Воскресенье в Германии
						</a>
						<a href="/100" className="article-panel__list-item">
							Про парковку
						</a>
						<a href="/200" className="article-panel__list-item">
							Про наклейку на лобовое стекло машины
						</a>
						<a href="/200" className="article-panel__list-item">
							Воскресенье в Германии
						</a>
						<a href="/100" className="article-panel__list-item">
							Про парковку
						</a>
						<a href="/200" className="article-panel__list-item">
							Про наклейку на лобовое стекло машины
						</a>
						<a href="/200" className="article-panel__list-item">
							Воскресенье в Германии
						</a>
						<a href="/100" className="article-panel__list-item">
							Про парковку
						</a>
						<a href="/200" className="article-panel__list-item">
							Про наклейку на лобовое стекло машины
						</a>
						<a href="/200" className="article-panel__list-item">
							Воскресенье в Германии
						</a>

					</div>
			</div>
		);
	}
}

export default createContainer((props = {}) => {

	props = Object.create(props);

	// const handle = Meteor.subscribe('article.type.list');
	//
	// props.loading = !handle.ready();
	// props.items = ArticleType.find().fetch();

	return props;
}, ArticleViewerList);