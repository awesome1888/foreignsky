/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
//import classnames from 'classnames';
import Util from '/imports/lib/util.js';
import {FileEntity} from '../../../../../imports/api/entity/file.js';

import App from '/imports/ui/app.jsx';

import './style.less';

export default class EmbedGalleryComponent extends React.Component {

	static propTypes = {
		item: PropTypes.arrayOf(PropTypes.shape({
			image: PropTypes.oneOf(PropTypes.string, PropTypes.shape({
				path: PropTypes.string,
			})).isRequired,
			label: PropTypes.string,
			options: PropTypes.shape({
				labelPosition: PropTypes.oneOf(['bottom', 'tl', 'tr', 'bl', 'br']),
			}),
		})),
		options: PropTypes.shape({
			height: PropTypes.number,
		}),
	};

	static defaultProps = {
		item: [],
		options: {
			height: 300,
		},
	};

	constructor(props)
	{
		super(props);

		this._scope = null;
		this.state = {};

		this.onWindowResize = this.onWindowResize.bind(this);
	}

	get options()
	{
		return this.props.options || {};
	}

	get item()
	{
		if(_.isArray(this.props.item))
		{
			return this.props.item;
		}

		return [];
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

		if(item && item.image.path)
		{
			App.instance.imageView.open(FileEntity.convertToUrl(item.image.path));
		}
	}

	render(props = {})
	{
	    // this shit definitely needs refactoring
	    let imgClass = '';
	    if (this.item.length === 2) {
	        imgClass = 'embed-gallery__image-2x1';
        }

		return (
			<div
				className="embed-gallery"
			    ref={(instance) => {this._scope = instance;}}
			>
				{
					this.item.map((item) => {
					    if (!_.isObjectNotEmpty(item.image) || !_.isStringNotEmpty(item.image.path)) {
					        return;
                        }

                        const url = FileEntity.convertToUrl(item.image.path);

						return (
							<a
								href={url}
								className={`embed-gallery__image ${imgClass}`}
								style={{
									backgroundImage: `url(${url})`
								}}
							    key={item._id}
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