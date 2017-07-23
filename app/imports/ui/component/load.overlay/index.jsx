/* eslint-disable class-methods-use-this */

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import PreRender from '/imports/lib/prerender.js';

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

    wait()
	{
	    if(PreRender.isCrawler) {
	        return; // when crawler do nothing
        }

		Promise.all(this.waitPool).then(() => {
		    this.startUnlocking();
        });
	}

	waitMe(promise)
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
					'loading-overlay fade',
					{'in': !this.state.transparent},
					{'out': this.state.transparent},
					{'no-display': !this.state.shown}
				)}
			>
				<div className="loading-overlay__greeting">
					 Типичный текст, который вы читаете, пока ждете загрузку...
				</div>
			</div>
		);
	}
}