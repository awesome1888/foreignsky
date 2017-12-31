/* eslint-disable class-methods-use-this */

import React from 'react';
// import { Progress } from 'semantic-ui-react';

import BaseComponent from '../../../../../lib/base/component/component.jsx';

import './style.less';

export default class GlobalLoadProgress extends BaseComponent {

    _timer = null;
    _pool = [];
    _locked = false;
    _active = false;
    _steps = null;
    _step = 0;

    constructor(props)
    {
        super(props);

        this.state = {
            percent: 0,
        };

        this.on('load-start', this.onLoadStart.bind(this));
        this.on('load-end', this.onLoadEnd.bind(this));
    }

    onLoadStart()
    {
        this.runProgress();
    }

    onLoadEnd()
    {
        Meteor.clearTimeout(this._timer);
        this.setPercent(100);
    }

    runProgress()
    {
        this._steps = this.getRandomPoints();
        this._step = 0;

        this.setPercent(0);
        this.goNextStep();
    }

    goNextStep()
    {
        this._timer = Meteor.setTimeout(
            () => {

                this.setPercent(this._steps[this._step]);
                this._step = this._step + 1;

                if(this._step === this._steps.length)
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

    isComplete()
    {
        return this.state.percent === 100;
    }

    render()
    {
        return (
            <div className="load-indicator">
                <div
                    className="load-indicator__progress"
                    style={{width: this.getPercent()+'%'}}
                />
            </div>
        );
    }
}
