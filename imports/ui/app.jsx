import React from 'react';

import Header from '/imports/ui/component/header/index.jsx';
import Map from '/imports/ui/component/map/index.jsx';
import AppLoadingOverlay from '/imports/ui/component/app.loading-overlay/index.jsx';

export default class App extends React.Component {

	constructor(props)
	{
		super(props);
		this.state = {
			loaded: false
		};

		this._overlay = null;
	}

	get overlay()
	{
		return this._overlay;
	}

	static get instance()
	{
		return this.getInstance();
	}

	static getInstance()
	{
		if(this._instance)
		{
			return this._instance;
		}

		return null;
	}

	componentWillMount()
	{
		App._instance = this;

		// start promise here
		// wait for:
		// 1) google map tiles loaded
		// 2) all data loaded:
		//      list, tags, article detail
	}

	componentDidMount()
	{
		console.dir('App mounted');
		this.overlay.waitAll();
	}

	render() {

		const {main, routeProps} = this.props;

		return (
			<div id="app">
				<div className="layout">
					<AppLoadingOverlay
						ref={(instance) => {this._overlay = instance;}}
					/>
					<Header />
					{React.createElement(main, {
						route: routeProps,
					})}
				</div>
				<Map />
			</div>
		);
	}
}