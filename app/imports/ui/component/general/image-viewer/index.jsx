/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import BaseComponent from '../../../../lib/base/component/component.jsx';

import './style.less';

export default class ImageViewer extends BaseComponent {

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

		this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
	}

    componentWillMount()
    {
        super.componentWillMount();

        this.on('open-image', (e, url) => {
            this.open(url);
        });
    }

    onDocumentKeyDown(e)
    {
        if (this.isOpened())
        {
            if (e && e.key === 'Escape')
            {
                this.close();
            }
        }
    }

	onCloseClick()
	{
		this.close();
	}

    onOverlayClick()
    {
        this.close();
    }

    onImageClick(e)
    {
        e.stopPropagation();
    }

    open(url)
    {
        if(_.isStringNotEmpty(url))
        {
            // todo: some loading
            this.setState({
                open: true,
                url: url,
            });

            this.on('document-keydown', this.onDocumentKeyDown);
        }
    }

    close()
    {
        this.setState({
            open: false,
        });

        this.off('document-keydown', this.onDocumentKeyDown);
    }

    isOpened()
    {
        return this.state.open;
    }

	render()
	{
		return (
			<div
				className={classnames({
					'image-view': true,
					'no-display': !this.isOpened(),
				})}
			>
				<div
                    className="image-view__overlay"
                    onClick={this.onOverlayClick.bind(this)}
                >
					<div className="image-view__container">
						<img
							className="image-view__image"
							src={this.state.url}
                            onClick={this.onImageClick.bind(this)}
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
