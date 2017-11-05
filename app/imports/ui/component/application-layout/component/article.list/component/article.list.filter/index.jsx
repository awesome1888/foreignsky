/* eslint-disable class-methods-use-this */

import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {TAPi18n} from 'meteor/tap:i18n';
import PropTypes from 'prop-types';

import ArticleTag from '../../../../../../../api/article.tag/entity/entity.client.js';
import BaseComponent from '../../../../../../../lib/base/component/component.jsx';

import './style.less';

export default class ArticleListFilterComponent extends BaseComponent {

	static propTypes = {
		onChange: PropTypes.func,
	};

	static defaultProps = {
		onChange: null,
	};

	constructor(params)
	{
		super(params);

		this.state = {
			filter: {},
			tags: [],
		};

		this.input = null;

		this.onInput = _.debounce(this.onInput.bind(this), 700);
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
		if (_.isFunction(this.props.onChange))
        {
            this.props.onChange(this.state.filter);
        }
	}

	resetFilter()
	{
		this.input.value = '';

		this.state.filter = {};
		this.setState(this.state);
        if (_.isFunction(this.props.onChange))
        {
            this.props.onChange(this.state.filter);
        }
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
		return this.getApplication().wait(ArticleTag.find({
            filter: {
                primary: true,
            },
            select: [
                'title',
                'color'
            ],
            sort: [
                ['sort', 'asc']
            ],
            limit: 3,
        }).then((data) => {
            this.setState({
                tags: data || [],
            });
        }).catch((err) => {
		    // todo: show notification here
        }));
	}

	render()
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
							key={item.getId()}
							data-id={item.getId()}
							className={`tag tag__button article-list__filter-button b-color_${item.getColor() ? item.getColor() : 'blue'}`}
							onClick={this.onTagClick.bind(this)}
						>
							{
								item.getId() === this.state.filter.tag
								&&
								<div className="tag__corner" />
							}
							#{item.getTitle().toLowerCase()}
						</div>;
					})}
				</div>
			</div>
		);
	}
}
