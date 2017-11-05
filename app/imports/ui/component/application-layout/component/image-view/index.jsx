/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './style.less';

export default class ImageViewComponent extends React.Component {

	static propTypes = {
		// label: PropTypes.shape({
		// 	text: PropTypes.string.isRequired,
		// 	position: PropTypes.oneOf(['bottom', 'tl', 'tr', 'bl', 'br']),
		// }),
		// image: PropTypes.string.isRequired,
		// height: PropTypes.number,
	};

	static defaultProps = {
		// label: {
		// 	position: 'bottom',
		// },
		// height: 300,
	};

	constructor(props)
	{
		super(props);
		this.state = {
			open: false,
			url: '',
		};
	}

	open(url)
	{
		if(_.isString(url) && url.length)
		{
			// todo: some loading
			this.setState({
				open: true,
				url: url,
			});
		}
	}

	onCloseClick()
	{
		this.setState({
			open: false,
		});
	}

	render()
	{
		return (
			<div
				className={classnames({
					'image-view': true,
					'no-display': !this.state.open,
				})}
			>
				<div className="image-view__overlay">
					<div className="image-view__container">
						<img
							className="image-view__image"
							src={this.state.url}
						/>
						<div
							className="image-view__close"
							onClick={this.onCloseClick.bind(this)}
						    title="Закрыть"
						/>
					</div>
				</div>
			</div>
		);
	}
}