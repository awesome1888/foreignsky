/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
//import classnames from 'classnames';
import Util from '/imports/lib/util.js';

import App from '/imports/ui/app.jsx';

import './style.less';

export default class EmbedGalleryComponent extends React.Component {

	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.shape({
			image: PropTypes.string.isRequired,
			label: PropTypes.string,
			size: PropTypes.array,
		})),
	};

	static defaultProps = {
		items: [],
	};

	constructor(props)
	{
		super(props);

		this._scope = null;
		this.state = {};

		this.onWindowResize = this.onWindowResize.bind(this);
	}

	onWindowResize()
	{
		return; // todo

		const w = window;
		const d = document;
		const documentElement = d.documentElement;
		const body = d.getElementsByTagName('body')[0];

		const width = w.innerWidth || documentElement.clientWidth || body.clientWidth;
		const height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;

		if(this.state.width !== width || this.state.height !== height)
		{
			this.setState({
				width: width,
				height: height,
			});
		}
	}

	componentWillMount()
	{
		this.onWindowResize();
	}

	componentDidMount()
	{
		window.addEventListener("resize", this.onWindowResize);
	}

	componentWillUnmount()
	{
		window.removeEventListener("resize", this.onWindowResize);
	}

	onImageClick(item, e)
	{
		e.preventDefault();

		if(item && item.image)
		{
			App.instance.imageView.open(item.image);
		}
	}

	render(props = {})
	{
		return (
			<div
				className="embed-gallery"
			    ref={(instance) => {this._scope = instance;}}
			>
				{
					this.props.items.map((item) => {
						return (

							<a
								href={item.image}
								className="embed-gallery__image"
								style={{
									backgroundImage: `url(${item.image})`
								}}
							    key={item.image+item.label}
								target="_blank"
								onClick={Util.passCtx(this.onImageClick, [item])}
							>
								{
									item.label
									&&
									<div className="embed-gallery__image-label">
										{item.label}
									</div>
								}
							</a>
						);
					})
				}
			</div>
		);
	}
}