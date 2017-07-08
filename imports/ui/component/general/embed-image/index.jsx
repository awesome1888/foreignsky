/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {FileEntity} from '../../../../../imports/api/entity/file.js';
import {EmbedEntity} from '../../../../../imports/api/entity/embed.js';
import Util from '/imports/lib/util.js';
import App from '/imports/ui/app.jsx';

//import './style.less';

export default class EmbedImageComponent extends React.Component {

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

	get options()
	{
		return this.props.options || {};
	}

	get item()
	{
		if(
			_.isArray(this.props.item)
			&&
			_.isObject(this.props.item[0])
		)
		{
			return this.props.item[0];
		}

		return {};
	}

	get imageUrl()
	{
		const image = this.item.image;

		if(_.isObject(image) && image.path)
		{
			return FileEntity.convertToUrl(image.path);
		}

		return '';
	}

	get height()
	{
		const height = parseInt(this.options.height);

		if(_.isNumber(height) && height > 0)
		{
			return height;
		}

		return 300;
	}

	get labelText()
	{
		const item = this.item;

		if(this.item.label)
		{
			return this.item.label.toString().trim();
		}

		return '';
	}

	get options()
    {
        return EmbedEntity.parseOptions(this.item.options);
    }

	get labelPosition()
	{
		const item = this.item;

		if(_.isObject(item.options) && item.options.labelPosition)
		{
			return item.options.labelPosition.toString().trim();
		}

		return 'bottom';
	}

	get labelTextFragments()
	{
		return this.labelText.split("\r\n");
	}

	isLabelTypeBottom()
	{
		return this.labelPosition === 'bottom' && _.isStringNotEmpty(this.labelText);
	}

	isLabelInside()
    {
        return _.isStringNotEmpty(this.labelText) && !this.isLabelTypeBottom();
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
        const options = this.options;
        const url = this.imageUrl;

        const style = {
            backgroundImage: `url(${url})`,
            height: `${this.height}px`,
        };

        if (_.isStringNotEmpty(options.previewVerticalAlign))
        {
            style.backgroundPositionY = options.previewVerticalAlign;
        }

		return (
			<div
				className="embed-image"
			>
				<a
                    href={url}
					className="embed-image__image embed-image__image_static"
					style={style}
                    target="_blank"
                    onClick={Util.passCtx(this.onImageClick, [this.item])}
				>
					{
						this.isLabelInside()
						&&
						<div className={classnames([
							'embed-image__label embed-image__label_medium',
							`embed-image__label-${this.labelPosition}`,
						])}>
							{
								this.labelTextFragments.map((fragment) => {
									return (<div
										className="embed-image__label-line"
									    key={fragment}
									>
										{fragment}
									</div>);
								})
							}
						</div>
					}

				</a>
				{
					this.isLabelTypeBottom()
					&&
					<div className="embed-image__label_bottom">
						{this.labelText}
					</div>
				}

			</div>
		);
	}
}