/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
//import {GoogleMap, Marker} from 'react-google-maps';
//import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";
import Util from '/imports/lib/util.js';

import App from '/imports/ui/app.jsx';

import './style.less';

export default class Map extends React.Component {

	static propTypes = {
		center: PropTypes.object,
		zoom: PropTypes.number,
	};

	static defaultProps = {
		center: {lat: -25.363, lng: 131.044},
		zoom: 4,
	};

	constructor(params)
	{
		super(params);
		this.useFakeMap = false;
		this.mapContainer = null;
		this._map = null;
	}

	componentWillMount()
	{

	}

	componentDidMount()
	{
		this.initializeMap();
	}

	get mapUrl()
	{
		return 'http://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyD2sbLti6b29JE3nZjUUk-LAav4BIH2vK0&libraries=geometry,drawing,places';
	}

	get map()
	{
		return this._map;
	}

	createMapObject()
	{
		return new Promise(function(resolve){

			this._map = new google.maps.Map(this.mapContainer, {
				zoom: this.props.zoom,
				center: this.props.center,
			});

			this.map.addListener('tilesloaded', function(){
				resolve();
			});

			// const marker = new google.maps.Marker({
			// 	position: uluru,
			// 	map: map
			// });

		}.bind(this));
	}

	initializeMap()
	{
		if(!Meteor.isClient)
		{
			return;
		}

		const p = new Promise(function(resolve, reject){
			Util.loadJs(this.mapUrl).then(function(){

				//console.dir('map loaded');
				return this.createMapObject();

			}.bind(this)).then(function(){

				//console.dir('map created');
				resolve();

			}, function(){
				reject();
			}).catch(function(){
				reject();
			});
		}.bind(this));

		if(App.instance)
		{
			App.instance.overlay.waitMe(p);
		}
	}

	render(props = {})
	{
		// props.containerElementProps = props.containerElementProps || {};
		// props.markers = props.markers || [];

		return (
			<div className="map">
				{
					this.useFakeMap
					&&
					<div className="map__container map__container_faded" />
				}
				{
					!this.useFakeMap
					&&
					<div
						className="map__container"
					    ref={(instance) => {this.mapContainer = instance}}
					>
						Loading
					</div>
				}
			</div>
		);
	}
}