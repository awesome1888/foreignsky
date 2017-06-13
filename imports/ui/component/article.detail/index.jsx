/* eslint-disable class-methods-use-this */

import React from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import Article from '/imports/api/entity/article.js';
import {TAPi18n} from 'meteor/tap:i18n';
import moment from 'moment';
import classnames from 'classnames';

import EmbedImageComponent from '/imports/ui/component/general/embed-image/index.jsx';
import EmbedGalleryComponent from '/imports/ui/component/general/embed-gallery/index.jsx';

import App from '/imports/ui/app.jsx';

import './style.less';

export default class ArticleDetailComponent extends React.Component {

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
				App.instance.setLoading(this.show(id));
			}
			else
			{
				this.close();
			}
		}
	}

	show(id)
	{
		return new Promise((resolve, reject) => {
			Article.createQuery({
				fields: {
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
							image: {
								url: 1,
								title: 1,
							},
							label: 1,
							options: 1,
						},
						renderer: 1,
						options: 1,
					},
				},
				filter: {
					_id: id,
					public: true,
				}
			}).fetchOne((err, res) => {
				if (!err)
				{
					this.setState({
						opened: true,
						data: res || {},
					});
					App.instance.mapToggleBlock(true);
                    App.instance.setTitle(res.title);
					resolve();
				}
				else
				{
					reject();
				}
			});
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
		App.instance.mapToggleBlock(false);
        App.instance.setTitle();
		FlowRouter.go('/');
	}

	makeText(data)
	{
		if(!_.isObject(data))
		{
			return '';
		}

		let text = data.text;

		if(!_.isString(text))
		{
			return '';
		}

		//console.dir(text);

		const expr = new RegExp('\\[EMBED\\s+ID=([a-zA-Z0-9]+)\\]', 'ig');
		let found = null;
		let parts = [];
		let prevIndex = 0;
		let chunk = '';
		while(found = expr.exec(text))
		{
			const till = expr.lastIndex - found[0].length;
			chunk = text.substr(prevIndex, till - prevIndex);

			if(chunk.length)
			{
				parts.push(React.createElement('div', {key: chunk}, chunk));
			}

			parts.push(this.makeEmbed(data, found[1]));
			// insert react component here...

			prevIndex = expr.lastIndex;
		}

		// when nothing were found or for the last part of the text
		chunk = text.substr(prevIndex, text.length - prevIndex);
		if(chunk.length)
		{
			parts.push(React.createElement('div', {key: chunk}, chunk));
		}

		//console.dir(parts);

		return parts;
	}

	/**
	 * @access protected
	 * @param data
	 * @param id
	 * @returns {null}
	 */
	makeEmbed(data, id)
	{
		if(!id || !_.isObject(data) || !_.isArray(data.embed))
		{
			return null;
		}

		id = id.toString().trim();
		if(!id)
		{
			return null;
		}

		const embedData = data.embed.find((item) => {return item._id === id});
		if(!_.isObject(embedData))
		{
			return null;
		}

		const renderer = this.getRendererClass(embedData.renderer);
		if(!renderer)
		{
			return null;
		}

		return React.createElement(renderer, {
			key: id,
			item: embedData.item,
			options: embedData.options,
		});
	}

	/**
	 * @access private
	 * @param code
	 * @returns {*}
	 */
	getRendererClass(code)
	{
		if(code === 'GALLERY')
		{
			return EmbedGalleryComponent;
		}
		else if(code === 'IMAGE')
		{
			return EmbedImageComponent;
		}
		else
		{
			return null;
		}
	}

	render(props = {})
	{
		const data = this.state.data;

		if(!data._id)
		{
			return null;
		}

		const content = this.makeText(data);

		return (
			<div
				className={classnames(
					'article-detail',
					{'no-display': !this.state.opened},
					`article-detail_${data.headerColor}`
				)}
			>
				<div className="article-detail__inner-scroll">

					<div
						className="embed-image article-detail__header-embed"
					>
						<div
							className="embed-image__image embed-image__image_static article-detail__header-image-embed"
							style={{
								backgroundImage: `url(${data.headerImage.url})`,
							}}
						>
							<div className="embed-image__label embed-image__label-br">
								<div className="embed-image__label-line">
									{data.title}
								</div>
							</div>
						</div>

					</div>

					<div className="article-detail__body-top-line">
						<div className="group-tag">
							{
								_.map(data.tag || {}, (tag) => {
									return (
										<div
											className={`tag tag_${tag.color ? tag.color : 'blue'}`}
										    key={tag._id}
										>
											#{tag.title.toLowerCase()}
										</div>
									);
								})
							}
						</div>
						<div className="article-detail__body-date">
							{
								data.date
								?
								moment(data.date).format('LL')
								:
								''
							}
						</div>
					</div>

					<div className="article-detail__body">

						{content}

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
