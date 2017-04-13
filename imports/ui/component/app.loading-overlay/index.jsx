/* eslint-disable class-methods-use-this */

import PropTypes from 'prop-types';
import React from 'react';

import './style.less';

export default class AppLoadingOverlay extends React.Component {

	static propTypes = {
		//appLoaded: PropTypes.boolean,
	};

	static defaultProps = {
		//appLoaded: false
	};

	constructor(props)
	{
		super(props);

		this.state = {
			shown: true,
		};

		this.waitPool = [];
	}

	/**
	 * temporal
	 */
	showWait()
	{
		console.dir(this.waitPool);
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
		//const loading = this.props.loading;

		return (
			<div className="loading-overlay">
				<div className="loading-overlay__greeting">
					Good morning, and welcome to the Black Mesa.
				</div>
			</div>
		);
	}
}