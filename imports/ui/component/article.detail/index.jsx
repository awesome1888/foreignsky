/* eslint-disable class-methods-use-this */

import React from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import Article from '/imports/api/entity/article.js';
import {TAPi18n} from 'meteor/tap:i18n';
import moment from 'moment';
import classnames from 'classnames';

import EmbedImageComponent from '/imports/ui/component/general/embedimage/index.js';
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
					}
				},
				filter: {'_id': id}
			}).fetchOne((err, res) => {
				if (!err)
				{
					this.setState({
						opened: true,
						data: res || {},
					});
					App.instance.map.toggleBlock(true);
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
		App.instance.map.toggleBlock(false);
		FlowRouter.go('/');
	}

	render(props = {})
	{
		const data = this.state.data;

		if(!data._id)
		{
			return null;
		}

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
						className="embed article-detail__header-embed"
					>
						<div
							className="embed__image embed__image_static article-detail__header-image-embed"
							style={{
								backgroundImage: `url(${data.headerImage.url})`,
							}}
						>
							<div className="embed__label embed__label-br">
								<div className="embed__label-line">
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

						{data.text}

						<EmbedImageComponent
							image="/img/sample3.jpg"
						    label={{
						    	text: "Вид на Рейхстаг из окна SonyCenter\r\nПамятник коммунистам и победе\r\nНу и еще заголовок до кучи!",
						        position: 'bl',
						    }}
						/>

						{data.text}

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
//
// export default createQueryContainer(Article.createQuery({
// 	fields: ['title'],
// 	sort: [
// 		{date: -1}
// 	]
// }, 'ArticleViewerDetailComponent'), ArticleViewerDetailComponent, {
// 	reactive: false,
// 	single: false,
// });