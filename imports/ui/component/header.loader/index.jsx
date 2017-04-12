/* eslint-disable class-methods-use-this */

import React from 'react';

import './style.less';

export default class HeaderLoader extends React.Component {

	constructor(props)
	{
		super(props);

		if(Meteor.isClient)
		{
			window.headerLoader = this;
		}

		this.state = {
			percent: 0,
		};
	}

	componentDidMount()
	{
		this.start();
	}

	start()
	{
		this.percent = 0;
		this.timer = Meteor.setInterval(
			this.incrementPercent.bind(this),
			1000
		);
	}

	finish()
	{
		this.percent = 100;
	}

	incrementPercent()
	{
		this.percent = this.percent + 10;
	}

	get percent()
	{
		return this.state.percent;
	}

	set percent(value)
	{
		value = parseInt(value);
		if(Number.isNaN(value))
		{
			value = 0;
		}

		if(value < 0 || value > 100)
		{
			value = 0;
		}

		this.setState({
			percent: value,
		});
	}

	render()
	{
		return (
			<div className="header__loading-bar">
				<div
					className="header__loading-bar-progress"
				    style={{width: this.percent+'%'}}
				/>
			</div>
		);
	}
}