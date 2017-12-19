/* eslint-disable class-methods-use-this */

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import PreRender from '../../../../../lib/prerender.js';
import BaseComponent from '../../../../../lib/base/component/component.jsx';

import './style.less';

export default class LoadOverlay extends BaseComponent {

	static propTypes = {
		transitionDuration: PropTypes.number,
        text: PropTypes.string,
	};

	static defaultProps = {
		transitionDuration: 700,
        text: 'Typical text you usually read while waiting the page to load :)',
	};

	constructor(props)
	{
		super(props);

		this.state = {
			shown: true,
			transparent: false,
		};

		this.waitPool = [];

		this.on('wait', this.onWait.bind(this));
	}

	// todo: move this to componentWillReceiveProps and when ready switched to true, wait 200 ms and only then start unlocking
	componentDidMount()
    {
        if(PreRender.isCrawler()) {
            return; // when crawler do nothing
        }

        Promise.all(this.waitPool).then(() => {
            this.startUnlocking();
        }).catch(() => {});
    }

    onWait(promise)
	{
		if(this.state.shown && promise)
		{
			this.waitPool.push(promise);
		}
	}

    /**
     * This method starts page unlocking
     */
    startUnlocking()
    {
        // "start" CSS animation
        this.setState({transparent: true});
        // wait until CSS animation end
        Meteor.setTimeout(() => {
            this.unLock();
        }, this.props.transitionDuration);
    }

    /**
     * This method finally unlocks the page
     */
    unLock()
    {
        this.setState({shown: false});
        PreRender.unLock();
    }

	render()
	{
		return (
			<div
				className={classnames(
					'load-overlay fade',
					{'out': this.state.transparent},
					{'none': !this.state.shown}
				)}
			>
				<div className="load-overlay__greeting">
                    {this.props.text}
				</div>
			</div>
		);
	}
}