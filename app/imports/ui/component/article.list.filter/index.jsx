/* eslint-disable class-methods-use-this */

import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {TAPi18n} from 'meteor/tap:i18n';
import PropTypes from 'prop-types';

import Query from './query/tag.query.js';
import Util from '/imports/lib/util.js';

import './style.less';

import App from '/imports/ui/application.jsx';

export default class ArticleListFilterComponent extends React.Component {

	static propTypes = {
		onChange: PropTypes.func,
	};

	static defaultProps = {
		onChange: Util.noop,
	};

	constructor(params)
	{
		super(params);

		this.state = {
			filter: {},
			tags: [],
		};

		this.input = null;

		this.onInput = Util.debounce(this.onInput.bind(this), 700);
	}

	onTagClick(e)
	{
		const tagId = e.target.dataset['id'];
		if(tagId)
		{
			this.mergeFilter({
				tag: tagId,
			});
		}
	}

	onResetFilterClick()
	{
		this.resetFilter();
	}

	mergeFilter(filter)
	{
		this.setState({filter: Object.assign(this.state.filter, filter)});
		this.props.onChange(this.state.filter);
	}

	resetFilter()
	{
		this.input.value = '';

		this.state.filter = {};
		this.setState(this.state);
		this.props.onChange(this.state.filter);
	}

	onInput(h, e)
	{
		this.mergeFilter({
			text: this.input.value,
		});
	}

	componentDidMount()
	{
		this.updateTagData();
	}

	updateTagData(params = {})
	{
		return App.getInstance().wait(new Promise((resolve, reject) => {
			Query.fetch((err, data) => {
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
		return (
			<div className="article-list__filter">
				<div className="article-list__filter-search">
				    <input
					    className="input article-list__filter-input"
					    type="text"
					    placeholder="Искать статью"
				        onKeyDown={this.onInput}
				        onInput={this.onInput}
				        ref={(instance) => {this.input = instance;}}
				        //value={this.state.filter.text || ''}
				    />
					{
						_.keys(this.state.filter).length > 0
						&&
						<button
							className="article-list__filter-clear"
							title="Сбросить фильтрацию"

						    onClick={this.onResetFilterClick.bind(this)}
						/>
					}
				</div>
				<div className="article-list__filter-button-set">
					{this.state.tags.map(item => {
						return <div
							key={item._id}
							data-id={item._id}
							className={`tag tag__button article-list__filter-button tag_${item.color ? item.color : 'blue'}`}
							onClick={this.onTagClick.bind(this)}
						>
							{
								item._id === this.state.filter.tag
								&&
								<div className="tag__corner" />
							}
							#{item.title.toLowerCase()}
						</div>;
					})}
				</div>
			</div>
		);
	}
}
