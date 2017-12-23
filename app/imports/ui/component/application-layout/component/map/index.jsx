/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import Util from '../../../../../lib/util.js';
import BaseComponent from '../../../../../lib/base/component/component.jsx';
import Option from '../../../../../api/option/entity/entity.client.js';

import './style.less';

export default class Map extends BaseComponent {

	static propTypes = {
		center: PropTypes.object,
		zoom: PropTypes.number,
        useFakeMap: PropTypes.boolean,
	};

	static defaultProps = {
		center: {lat: 54.714187, lng: 20.581439},
		zoom: 14,
        useFakeMap: false,
	};

	constructor(params)
	{
		super(params);
		this.mapContainer = null;
		this._map = null;

		this.state = {
			blocked: false,
		};
	}

    /**
     * Toggles map overlay
     * @param way
     */
	toggleBlock(way)
	{
		this.setState({blocked: !!way});
	}

	componentDidMount()
	{
	    if(!this.props.useFakeMap)
        {
            this.initializeMap();
        }
	}

	getKey()
    {
        const key = Option.findOnePublished({name: 'vendor.google.map.key'});
        if (key && _.isStringNotEmpty(key.getValue()))
        {
            return key.getValue();
        }

        return '';
    }

	getMapUrl()
	{
	    const key = this.getKey();
		return `https://maps.googleapis.com/maps/api/js?v=3&key=${key}&libraries=geometry,drawing,places`;
	}

	getMap()
	{
		return this._map;
	}

	static getInstance()
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

			this.getMap().addListener('tilesloaded', () => {
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
		return this.getApplication().wait(Util.loadJs(this.getMapUrl()).then(() => {
            return this.createMapObject();
        }).catch(() => {
            // todo: NOTIF
        }));
	}

	render()
	{
		// props.containerElementProps = props.containerElementProps || {};
		// props.markers = props.markers || [];

		return (
			<div className="map">
				{
					this.props.useFakeMap
					&&
					<div className="map__container map__container_map-fake" />
				}
				{
				    !this.props.useFakeMap
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