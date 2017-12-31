/* eslint-disable class-methods-use-this */

import React from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import BaseComponent from '../../../../../lib/base/component/component.jsx';

import ArticleListFilterComponent from './component/article.list.filter/index.jsx';
import Article from '../../../../../api/article/entity/entity.client.js';

import './style.less';

export default class ArticleListComponent extends BaseComponent
{
	constructor(params)
	{
		super(params);

		this.extendState({
            data: [],
        });
	}

	onFilterChange(params)
	{
		this.updateItemListData(params);
	}

	componentDidMount()
	{
		this.updateItemListData();
	}

	updateItemListData(params = {})
	{
		const filter = {
		    public: true,
		};
		if('tag' in params)
		{
			filter.tagId = params.tag;
		}
		if('text' in params && _.isString(params.text))
		{
			params.text = params.text.trim().toUpperCase();
			if(params.text)
			{
				filter.$text = {
					$search: params.text,
					//$diacriticSensitive: false,
					//$caseSensitive: true,
				};
			}
		}

        return this.getApplication().wait(Article.find({filter, select: ['title']}).then((data) => {
            return new Promise((resolve) => {
                this.setState({
                    data: data || [],
                }, () => {
                    console.dir('Loaded list!');
                    resolve();
                });
            });
        }).catch((err) => {
            // todo: show the notification here NOTIF
        }));

        // return this.getApplication().wait(Article.find({filter, select: ['title']}).then((data) => {
		 //    console.dir('Loaded list!');
        //     this.setState({
        //         data: data || [],
        //     });
        // }).catch((err) => {
		 //    // todo: show the notification here NOTIF
        // }));
	}

	hasData() {
	    return _.isArrayNotEmpty(this.state.data);
    }

	render()
	{
	    const data = this.state.data;
	    
		return (
			<div className="article-list">
				<ArticleListFilterComponent
					onChange={this.onFilterChange.bind(this)}
				/>
				<div className="article-list__list">
					<div className="article-list__list-scroll">
                        {
                            !this.hasData()
                            &&
                            <div className="text_size_minor">
                                Нет статей для показа. Плак :'(
                            </div>
                        }
						{
                            this.hasData()
                            &&
                            data.map(item => {
								return (
									<a key={item.getId()} href={`/${item.getId()}`} className="article-list__list-item">
										{item.getTitle()}
									</a>
								);
							})
						}
					</div>
				</div>
			</div>
		);
	}
}
