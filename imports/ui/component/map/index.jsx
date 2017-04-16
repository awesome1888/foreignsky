/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import Util from '/imports/lib/util.js';

import App from '/imports/ui/app.jsx';

import './style.less';

export default class Map extends React.Component {

	static propTypes = {
		center: PropTypes.object,
		zoom: PropTypes.number,
	};

	static defaultProps = {
		center: {lat: 54.714187, lng: 20.581439},
		zoom: 14,
	};

	constructor(params)
	{
		super(params);
		this.useFakeMap = false;
		this.mapContainer = null;
		this._map = null;

		this.state = {
			blocked: false,
		};
	}

	toggleBlock(way)
	{
		this.setState({blocked: !!way});
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

	static get instance()
	{
		if(this._instance)
		{
			return this._instance;
		}

		return null;
	}

	createMapObject()
	{
		return new Promise((resolve) => {

			this._map = new google.maps.Map(this.mapContainer, {
				zoom: this.props.zoom,
				center: this.props.center,
			});

			this.map.addListener('tilesloaded', () => {
				resolve();
			});

			// const marker = new google.maps.Marker({
			// 	position: uluru,
			// 	map: map
			// });
		});
	}

	initializeMap()
	{
		if(!Meteor.isClient)
		{
			return;
		}

		return App.instance.setLoading(new Promise((resolve, reject) => {
			Util.loadJs(this.mapUrl).then(() => {

				return this.createMapObject();

			}).then(() => {

				resolve();

			}, () => {
				reject();
			}).catch(() => {
				reject();
			});
		}));
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
					<div className="map__container" />
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
				{
					this.state.blocked
					&&
					<div className="map__overlay" />
				}
			</div>
		);
	}
}