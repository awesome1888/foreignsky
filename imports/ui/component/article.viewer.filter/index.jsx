/* eslint-disable class-methods-use-this */

import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { TAPi18n } from 'meteor/tap:i18n';

import TagListComponent from './component/tag.list/index.jsx';

import './style.less';

export default class ArticleViewerFilterComponent extends React.Component {

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

	render(props = {})
	{
		return (
			<div className="article-panel__filter">
				<div className="article-panel__filter-search">
				    <input className="input article-panel__filter-input" type="text" placeholder="Искать статью" />
				</div>
				<TagListComponent
					onClick={this.handleTypeClick}
				/>
			</div>
		);
	}
}