import React from 'react';

import Header from '/imports/ui/component/header/index.jsx';
import Map from '/imports/ui/component/map/index.jsx';
import LoadOverlay from '/imports/ui/component/load.overlay/index.jsx';
import LoadIndicator from '/imports/ui/component/load.indicator/index.jsx';

export default class App extends React.Component {

	constructor(props)
	{
		super(props);
		this.state = {
			loaded: false
		};

		this._overlay = null;
		this._map = null;
		this._indicator = null;
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

	get indicator()
	{
		return this._indicator;
	}

	set indicator(ref)
	{
		if(!this._indicator)
		{
			this._indicator = ref;
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
			this.indicator.addProcess(p);
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
					<LoadOverlay
						ref={(instance) => {this.overlay = instance;}}
					/>
					<div className="layout__central layout__header">
						<Header />
						<LoadIndicator
							ref={(instance) => {this.indicator = instance;}}
						/>
					</div>
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