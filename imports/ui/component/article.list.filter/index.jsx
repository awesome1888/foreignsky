/* eslint-disable class-methods-use-this */

import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {TAPi18n} from 'meteor/tap:i18n';
import PropTypes from 'prop-types';

import ArticleTag from '/imports/api/entity/article/tag.js';
import Util from '/imports/lib/util.js';

import './style.less';

import App from '/imports/ui/app.jsx';

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
			applied: false,
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
			this.props.onChange({
				tag: tagId,
			});

			this.setState({applied: true});
		}
	}

	onResetFilterClick()
	{
		this.input.value = '';

		this.props.onChange({});
		this.setState({applied: false});
	}

	onInput(h, e)
	{
		const value = this.input.value;

		this.props.onChange({
			text: value,
		});

		this.setState({applied: !!value});
	}

	componentDidMount()
	{
		this.updateTagData();
	}

	updateTagData(params = {})
	{
		let filter = {
			primary: true,
		};

		return App.instance.setLoading(new Promise((resolve, reject) => {

			ArticleTag.createQuery({
				filter: filter,
				fields: ['title', 'color'],
				sort: [
					['sort', 'asc']
				]
			}).fetch((err, data) => {
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
				    />
					{
						this.state.applied
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
							#{item.title.toLowerCase()}
						</div>;
					})}
				</div>
			</div>
		);
	}
}