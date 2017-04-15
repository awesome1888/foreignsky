/* eslint-disable class-methods-use-this */

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import './style.less';

export default class AppLoadingOverlay extends React.Component {

	static propTypes = {
		transitionDuration: PropTypes.number,
	};

	static defaultProps = {
		transitionDuration: 700
	};

	constructor(props)
	{
		super(props);

		this.state = {
			shown: true,
			transparent: false,
		};

		this.waitPool = [];
	}

	/**
	 * temporal
	 */
	waitAll()
	{
		Promise.all(this.waitPool).then(function(){

			this.setState({transparent: true});
			Meteor.setTimeout(() => {
				this.setState({shown: false});
			}, this.props.transitionDuration);

		}.bind(this));
	}

	waitMe(promise)
	{
		if(this.state.shown && promise)
		{
			this.waitPool.push(promise);
		}
	}

	render()
	{
		return (
			<div
				className={classnames(
					'loading-overlay fade',
					{'in': !this.state.shown},
					{'out': this.state.transparent},
					{'no-display': !this.state.shown}
				)}
			>
				<div className="loading-overlay__greeting">
					Good morning, and welcome to the Black Mesa.
				</div>
			</div>
		);
	}
}