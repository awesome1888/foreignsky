/* eslint-disable class-methods-use-this */

import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { TAPi18n } from 'meteor/tap:i18n';

import {BaseTags} from './query.js';

import './style.less';

class ArticleViewerFilter extends React.Component {

	constructor(params)
	{
		super(params);

		this.handleTypeClick = this.handleTypeClick.bind(this);

		// just test
		BaseTags.fetch((error, response) => {
			console.dir(error);
			console.dir(response);
		});
	}

	handleTypeClick(e)
	{
		const typeId = e.target.dataset['id'];
		if(typeId)
		{
			console.dir(typeId);
		}
	}

	render(props = {})
	{
		const {loading, items} = this.props;

		return (
			<div className="article-panel__filter">
				<div className="article-panel__filter-search">
				    <input className="input article-panel__filter-input" type="text" placeholder={TAPi18n.__('component.article.viewer.filter.searchPlaceholder')} />
				</div>
				<div className="article-panel__filter-button-set">
					{items.map(item => {
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
			</div>
		);
	}
}

export default createContainer((props = {}) => {

	props = Object.create(props);

	props.loading = true;
	props.items = [];

	return props;
}, ArticleViewerFilter);