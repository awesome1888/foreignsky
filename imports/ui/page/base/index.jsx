/* eslint-disable class-methods-use-this */

import React from 'react';
import {DocHead} from 'meteor/kadira:dochead';

export default class BasePage extends React.Component {

    static propTypes = {
    };

    static defaultProps = {
    };

    constructor(props)
    {
        super(props);
    }

	get routeParams()
	{
		return this.props.route || {};
	}

	getCentralHtml(props)
	{
		return ('');
	}

	getSideHtml(props)
	{
		return ('');
	}

	render(props)
	{
		return (
			<div className="layout__central layout__central-body container">
				<div className="layout__central-row row">
					<div className="layout__central-body-left col-xs-3">
						{this.getSideHtml(props)}
					</div>
					<div className="layout__central-body-right col-xs-9">
						{this.getCentralHtml(props)}
					</div>
				</div>
			</div>
		);
	}
}
