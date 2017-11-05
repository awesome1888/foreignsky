/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import File from '../../../../../../../api/file/entity/entity.client.js';
import Embed from '../../../../../../../api/embed/entity/entity.client.js';
import Util from '../../../../../../../lib/util.js';
import App from '/imports/ui/application.jsx';

//import './style.less';

export default class EmbedImageComponent extends React.Component {

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

	// getOptions()
	// {
	// 	return this.props.options || {};
	// }

	getItem()
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

	getImage()
    {
        const data = this.getItem().image;
        if (_.isObjectNotEmpty(data))
        {
            return new File(data);
        }

        return null;
    }

	getHeight()
	{
		const height = parseInt(this.getOptions().height);

		if(_.isNumber(height) && height > 0)
		{
			return height;
		}

		return 300;
	}

	getLabelText()
	{
		const item = this.getItem();

		if(item.label)
		{
			return item.label.toString().trim();
		}

		return '';
	}

	getOptions()
    {
        return Embed.unpackOptions(this.getItem().options);
    }

	getLabelPosition()
	{
		const item = this.getItem();

		if(_.isObject(item.options) && item.options.labelPosition)
		{
			return item.options.labelPosition.toString().trim();
		}

		return 'bottom';
	}

	getLabelTextFragments()
	{
		return this.labelText.split("\r\n");
	}

	isLabelTypeBottom()
	{
		return this.getLabelPosition() === 'bottom' && _.isStringNotEmpty(this.getLabelText());
	}

	isLabelInside()
    {
        return _.isStringNotEmpty(this.getLabelText()) && !this.isLabelTypeBottom();
    }

    onImageClick(item, e)
    {
        e.preventDefault();

        if(item && item.image.url)
        {
            App.getInstance().getImageView().open(File.convertToUrl(item.image.path));
        }
    }

	render()
	{
        const options = this.getOptions();
        const image = this.getImage();
        if (!image)
        {
            return null;
        }

        const style = {
            backgroundImage: `url(${image.getAbsoluteUrlImage([900, 300])})`,
            height: `${this.getHeight()}px`,
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
                    href={image.getAbsoluteUrl()}
					className="embed-image__image embed-image__image_static"
					style={style}
                    target="_blank"
                    onClick={Util.passCtx(this.onImageClick, [this.getItem()])}
				>
					{
						this.isLabelInside()
						&&
						<div className={classnames([
							'embed-image__label embed-image__label_medium',
							`embed-image__label-${this.getLabelPosition()}`,
						])}>
							{
								this.getLabelTextFragments().map((fragment) => {
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
						{this.getLabelText()}
					</div>
				}

			</div>
		);
	}
}
