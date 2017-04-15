/* eslint-disable class-methods-use-this */

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

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
			}, 700);

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
		//const loading = this.props.loading;

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