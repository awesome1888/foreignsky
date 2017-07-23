/* eslint-disable class-methods-use-this */

import React from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {TAPi18n} from 'meteor/tap:i18n';
import classnames from 'classnames';

import App from '/imports/ui/app.jsx';
import BaseComponent from '../../../lib/base/component/component.jsx';
import Article from '../../../api/article/entity/entity.client.js';

import EmbedImageComponent from '../../../ui/component/general/embed-image/index.jsx';
import EmbedGalleryComponent from '../../../ui/component/general/embed-gallery/index.jsx';

import './style.less';

export default class ArticleDetailComponent extends BaseComponent
{
	constructor(params)
	{
		super(params);
		this.state = {
			id: null,
			opened: false,
			data: {},
		};
	}

	componentDidMount()
	{
		this.handleIdUpdate(this.props.id);
	}

	componentWillReceiveProps(next)
	{
		this.handleIdUpdate(next.id);
	}

	handleIdUpdate(id)
	{
		if(id !== this.state.id)
		{
			this.setState({id: id});

			if(id)
			{
				App.instance.wait(this.show(id));
			}
			else
			{
				this.close();
			}
		}
	}

	async show(id)
	{
        const p = Article.findOne({
            select: {
                title: 1,
                text: 1,
                date: 1,
                headerColor: 1,
                headerImage: {
                    title: 1,
                    path: 1,
                },
                tag: {
                    title: 1,
                    color: 1,
                },
                embed: {
                    item: {
                        label: 1,
                        options: 1,
                        imageId: 1,
                        image: 1,
                    },
                    renderer: 1,
                    options: 1,
                },
            },
            filter: {
                _id: id,
            },
        });

        p.then((article) => {
            if(!article)
            {
                FlowRouter.go('/404');
                return;
            }

            this.setState({
                opened: true,
                data: article.data,
                article,
            });
            App.instance.toggleMap(true);
            this.setTitle(article.title);
        });

        return p;
	}

	close()
	{
		if(!this.state.opened)
		{
			return;
		}

		this.setState({
			opened: false
		});
		App.instance.toggleMap(false);
		FlowRouter.go('/');
	}

	render(props = {})
	{
		const article = this.state.article;
		if(!article || !article.id)
		{
			return null;
		}

		return (
			<div
				className={classnames(
					'article-detail',
					{'no-display': !this.state.opened},
					`article-detail_${article.headerColor}`
				)}
			>
				<div className="article-detail__inner-scroll">
                    {
                        article.hasHeaderImage()
                        &&
                        <div
                            className="embed-image article-detail__header-embed"
                        >
                            <div
                                className="embed-image__image embed-image__image_static article-detail__header-image-embed"
                                style={{
                                    backgroundImage: `url(${article.headerImagePath})`,
                                }}
                            >
                                <div className="embed-image__label embed-image__label-br">
                                    <div className="embed-image__label-line">
                                        {article.title}
                                    </div>
                                </div>
                            </div>

                        </div>
                    }
					<div className="article-detail__body-top-line">
						<div className="group-tag">
							{
								_.map(article.tag || {}, (tag) => {
									return (
										<div
											className={`tag tag_${tag.color}`}
										    key={tag.id}
										>
											#{tag.title}
										</div>
									);
								})
							}
						</div>
						<div className="article-detail__body-date">
							{article.dateFormatted}
						</div>
					</div>
					<div className="article-detail__body">
						{article.renderText({
                            IMAGE: EmbedImageComponent,
                            GALLERY: EmbedGalleryComponent,
                        })}
					</div>
				</div>
				<div
					className="article-detail__close-page"
				    onClick={this.close.bind(this)}
				/>
			</div>
		);
	}
}
