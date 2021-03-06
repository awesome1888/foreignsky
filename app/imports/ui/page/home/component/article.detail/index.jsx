/* eslint-disable class-methods-use-this */

import React from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {TAPi18n} from 'meteor/tap:i18n';
import classnames from 'classnames';

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
	    let getOnlyPublic = true;

	    const q = this.getApplication().getQuery();
	    if (q.token)
        {
            let token;
            try
            {
                token = await this.execute('article.draftToken.get');
            }
            catch(e)
            {
                // todo: NOTIF
                this.goByError(e); // todo: probably not going anywhere, just show the notification
                return;
            }

            getOnlyPublic = q.token !== token;
        }

        const filter = {
            _id: id,
        };
	    if (getOnlyPublic)
        {
            filter.public = true;
        }

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
            filter,
        }).then((article) => {
            if(!article)
            {
                this.go404();
                return;
            }

            return new Promise((resolve) => {
                this.setTitle(article.getTitle());
                this.setState({
                    opened: true,
                    data: article.data,
                    article,
                }, () => {
                    resolve();
                });
            });
        }).catch((e) => {
	        // todo: NOTIF
            this.goByError(e); // todo: probably not going anywhere, just show the notification
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
					'article-detail page-content',
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
