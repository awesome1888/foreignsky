/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
//import classnames from 'classnames';
import BaseComponent from '../../../../../../../lib/base/component/component.jsx';

import File from '../../../../../../../api/file/entity/entity.client.js';
import Embed from '../../../../../../../api/embed/entity/entity.client.js';

import './style.less';

export default class EmbedGalleryComponent extends BaseComponent {

	static propTypes = {
		item: PropTypes.arrayOf(PropTypes.shape({
			image: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
				path: PropTypes.string,
			})]).isRequired,
			label: PropTypes.string,
			// options: PropTypes.shape({
			// 	labelPosition: PropTypes.oneOf(['bottom', 'tl', 'tr', 'bl', 'br']),
			// }),
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

    componentWillMount()
    {
        super.componentWillMount();

        this.onDocumentClick('a[data-open-image="true"]', this.onImageClick.bind(this));
        // this.on('window-metric-change', this.onWindowResize.bind(this));
    }

    onImageClick(e, node)
    {
        this.fire('open-image', [node.getAttribute('href')]);
        e.preventDefault();
    }

	getOptions()
	{
		return this.props.options || {};
	}

	getItem()
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

	sortItems(items) {
	    return items.sort((a, b) => {
	        // todo: nasty
            const aOpt = Embed.unpackOptions(a.options);
            const bOpt = Embed.unpackOptions(b.options);
            
            return aOpt.order > bOpt.order ? 1 : -1;
        });
    }

    getImage(item)
    {
        const data = item.image;
        if (_.isObjectNotEmpty(data))
        {
            return new File(data);
        }

        return null;
    }

	render()
	{
	    const count = this.getItem().length;
        const size = null;
        // const size = [800, 200];
        // if (count === 2)
        // {
        //     size[0] = 400;
        // }
        // if (count > 2)
        // {
        //     size[2] = 200;
        // }

	    // this shit definitely needs refactoring
	    let imgClass = '';
	    if (count === 2) {
	        imgClass = 'embed-gallery__image-2x1';
        }

		return (
			<div
				className="embed-gallery"
			    ref={(instance) => {this._scope = instance;}}
			>
				{
					this.sortItems(this.getItem()).map((item) => {
					    const image = this.getImage(item);
					    if (!image) {
					        return;
                        }

                        const options = Embed.unpackOptions(item.options);

                        const style = {
                            backgroundImage: `url(${image.getAbsoluteUrlImage(size)})`
                        };

                        if (_.isStringNotEmpty(options.previewVerticalAlign))
                        {
                            style.backgroundPositionY = options.previewVerticalAlign;
                        }

						return (
							<a
								href={image.getAbsoluteUrl()}
								className={`embed-gallery__image ${imgClass}`}
								style={style}
							    key={image.getId()}
								target="_self" // to prevent FlowRouter from working on this link
                                data-open-image
							>
								{
									_.isStringNotEmpty(item.label)
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
