/* eslint-disable class-methods-use-this */

import React from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {TAPi18n} from 'meteor/tap:i18n';
import classnames from 'classnames';
import Util from '../../../../../lib/util.js';

import BaseComponent from '../../../../../lib/base/component/component.jsx';
import Article from '../../../../../api/article/entity/entity.client.js';

import EmbedImageComponent from './component/embed-image/index.jsx';
import EmbedGalleryComponent from './component/embed-gallery/index.jsx';

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

		this.onDocumentClick('a[data-open-image="true"]', this.onImageClick.bind(this));
	}

	componentWillReceiveProps(next)
	{
		this.handleIdUpdate(next.id);
	}

    onImageClick(e, node)
    {
        console.dir(node);
    }

	handleIdUpdate(id)
	{
		if(id !== this.state.id)
		{
			this.setState({id: id});

			if(id)
			{
				this.getApplication().wait(this.show(id));
			}
			else
			{
				this.close();
			}
		}
	}

	getId()
    {
        return this.props.id;
    }

	async show(id)
	{
        return Article.findOne({
            select: {
                title: 1,
                text: 1,
                date: 1,
                headerColor: 1,
                headerImage: {
                    title: 1,
                    url: 1,
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
                public: true,
            },
        }).then((article) => {
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

            // App.getInstance().toggleMap(true);
            this.setTitle(article.getTitle());
        });
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
		// App.getInstance().toggleMap(false);
		FlowRouter.go('/');
	}

	render()
	{
		const article = this.state.article;
		if(!this.getId() || !article || !article.getId())
		{
			return null;
		}

		return (
			<div
				className={classnames(
					'article-detail',
					{'no-display': !this.state.opened},
					`article-detail_${article.getHeaderColor()}`
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
                                    backgroundImage: `url(${article.getHeaderImageUrl([900, 200])})`,
                                }}
                            >
                                <div className="embed-image__label embed-image__label-br">
                                    <div className="embed-image__label-line">
                                        {article.getTitle()}
                                    </div>
                                </div>
                            </div>

                        </div>
                    }
					<div className="article-detail__body-top-line">
						<div className="group-tag">
							{
								_.map(article.getTag() || {}, (tag) => {
									return (
										<div
											className={`tag b-color_${tag.getColor()}`}
										    key={tag.getId()}
										>
											#{tag.getTitle()}
										</div>
									);
								})
							}
						</div>
						<div className="article-detail__body-date">
							{article.getDateFormatted()}
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
