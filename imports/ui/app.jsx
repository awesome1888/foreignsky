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
		this._map = null;
	}

	get overlay()
	{
		return this._overlay;
	}

	set overlay(ref)
	{
		if(!this._overlay)
		{
			this._overlay = ref;
		}
	}

	get map()
	{
		return this._map;
	}

	set map(ref)
	{
		if(!this._map)
		{
			this._map = ref;
		}
	}

	setLoading(p)
	{
		if(this.overlay)
		{
			this.overlay.waitMe(p);
		}

		return p;
	}

	static get instance()
	{
		if(this._instance)
		{
			return this._instance;
		}

		// return mock
		return {
			setLoading: function(){},
		};
	}

	componentWillMount()
	{
		console.dir('re-mount!');
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
						ref={(instance) => {this.overlay = instance;}}
					/>
					<Header />
					{React.createElement(main, {
						route: routeProps,
					})}
				</div>
				<Map
					ref={(instance) => {this.map = instance;}}
				    center={{lat: 52.520764, lng: 13.409161}}
				    zoom={15}
				/>
			</div>
		);
	}
}