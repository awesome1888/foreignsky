/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

//import './style.less';

export default class EmbedImageComponent extends React.Component {

	static propTypes = {
		label: PropTypes.shape({
			text: PropTypes.string.isRequired,
			position: PropTypes.oneOf(['bottom', 'tl', 'tr', 'bl', 'br']),
		}),
		image: PropTypes.string.isRequired,
		height: PropTypes.number,
	};

	static defaultProps = {
		label: {
			position: 'bottom',
		},
		height: 300,
	};

	get image()
	{
		return this.props.image;
	}

	get height()
	{
		return this.props.height;
	}

	get labelText()
	{
		return this.props.label.text;
	}

	get labelTextFragments()
	{
		return this.props.label.text.split("\r\n");
	}

	get labelPosition()
	{
		return this.props.label.position || 'tl';
	}

	isLabelTypeBottom()
	{
		return this.props.label.position == 'bottom';
	}

	render(props = {})
	{
		return (
			<div
				className="embed-image"
			>
				<div
					className="embed-image__image embed-image__image_static"
					style={{
						backgroundImage: `url(${this.image})`,
						height: `${this.height}px`,
					}}
				>
					{
						!this.isLabelTypeBottom()
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

				</div>
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