import React from 'react';

import BaseComponent from '../../../../../lib/base/component/component.jsx';
import Util from '../../../../../lib/util.js';

import PropTypes from 'prop-types';

import './style.less';

/**
 * if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function (position) {
         initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         map.setCenter(initialLocation);
     });
 }
 */
export default class GoogleMap extends BaseComponent
{
    static propTypes = {
        className: PropTypes.string,
        center: PropTypes.object,
        zoom: PropTypes.number,
    };

    static defaultProps = {
        className: '',
        center: {lat: 54.714187, lng: 20.581439},
        zoom: 14,
    };

    _mapContainer = null;

    constructor(props)
    {
        super(props);
        // this.extendState({
        // });
    }

    componentDidMount()
    {
        this.initializeMap();
    }

    getMapUrl()
    {
        const key = Meteor.settings.public['google-maps_key'];
        return `https://maps.googleapis.com/maps/api/js?v=3&key=${key}&libraries=geometry,drawing,places`;
    }

    getMap()
    {
        return this._map;
    }

    createMapObject()
    {
        return new Promise((resolve) => {

            const params = {
                zoom: this.props.zoom,
            };
            if (_.isObjectNotEmpty(this.props.center))
            {
                params.center = this.props.center;
            }

            // console.dir(params);
            // console.dir(this.props);

            this._map = new google.maps.Map(this._mapContainer, params);

            this.getMap().addListener('tilesloaded', () => {
                resolve();
            });

            if (_.isArrayNotEmpty(this.props.markers))
            {
                this.props.markers.forEach((marker) => {
                    const loc = marker.location;
                    let markerRef = new google.maps.Marker({
                    	position: loc,
                    	map: this._map
                    });
                });
            }
        });
    }

    initializeMap()
    {
        return new Promise((resolve, reject) => {
            Util.loadJs(this.getMapUrl()).then(() => {
                return this.createMapObject();
            }).then(() => {
                resolve();
            }, () => {
                reject();
            }).catch(() => {
                reject();
            });
        });
    }

    render()
    {
        return (
            <div
                className={`google-map ${this.getClassName()}`}
                ref={ ref => {this._scope = ref; }}
            >
                <div
                    className="google-map__container"
                    ref={(instance) => {this._mapContainer = instance}}
                >
                    Loading...
                </div>
            </div>
        );
    }
}
