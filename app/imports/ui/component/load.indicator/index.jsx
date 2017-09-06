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

		this.lockPool = Util.debounce(this.lockPool.bind(this));
	}

	componentDidMount()
	{
		this.launch();
	}

	waitOne(p)
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

		this.lockPool(); // no more new tasks, sorry
	}

	lockPool()
	{
		this.locked = true;

        Promise.all(this.pool).then(() => {
			Meteor.clearTimeout(this.timer);
			this.active = false;
			this.setPercent(100);
			this.locked = false;
        }, (err) => {
		    console.dir(err);
        });
	}

	launch()
	{
		this.steps = this.getRandomPoints();
		this.step = 0;
		this.active = true;
		this.locked = false;
		this.pool = [];
		this.setPercent(0);

		this.goNextStep();
	}

	goNextStep()
	{
		this.timer = Meteor.setTimeout(
			() => {

				this.setPercent(this.steps[this.step]);
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
			_.random(300, 900)
		);
	}

	getRandomPoints()
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

	getPercent()
	{
		return this.state.percent;
	}

	setPercent(value)
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
				    style={{width: this.getPercent()+'%'}}
				/>
			</div>
		);
	}
}