/* eslint-disable class-methods-use-this */

import React from 'react';

import Util from '/imports/lib/util.js';

import './style.less';

export default class LoadIndicator extends React.Component {

	constructor(props)
	{
		super(props);

		this.state = {
			percent: 0,
		};
		this.timer = null;

		this.lockPool = Util.debounce(this.lockPool);
	}

	componentDidMount()
	{
		this.launch();
	}

	addProcess(p)
	{
		if(this.locked)
		{
			return false;
		}

		if(!this.active)
		{
			this.launch();
		}

		this.pool.push(p);

		this.lockPool();
	}

	lockPool()
	{
		this.locked = true;
		Promise.all(this.pool).then(() => {
			Meteor.clearTimeout(this.timer);
			this.active = false;
			this.percent = 100;
			this.locked = false;
		});
	}

	launch()
	{
		this.steps = this.randomPoints;
		this.step = 0;
		this.active = true;
		this.locked = false;
		this.pool = [];
		this.percent = 0;

		this.goNextStep();
	}

	goNextStep()
	{
		this.timer = Meteor.setTimeout(
			() => {

				this.percent = this.steps[this.step];
				this.step = this.step + 1;

				if(this.step === this.steps.length)
				{
					return false;
				}
				else
				{
					this.goNextStep();
				}
			},
			_.random(100, 800)
		);
	}

	get randomPoints()
	{
		// todo: random number of steps here
		return [
			_.random(0, 10),
			_.random(11, 20),
			_.random(21, 30),
			_.random(31, 40),
			_.random(41, 50),
			_.random(51, 60),
			_.random(61, 70),
			_.random(71, 80),
			_.random(81, 90),
		];
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

		console.dir(value+'%');

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