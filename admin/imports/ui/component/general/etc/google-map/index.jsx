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
        markers: PropTypes.array,
        onMapLocationClick: PropTypes.func,
        onMarkerDrag: PropTypes.func,
    };

    static defaultProps = {
        className: '',
        center: {lat: 54.714187, lng: 20.581439},
        zoom: 14,
        markers: [],
        onMapLocationClick: null,
        onMarkerDrag: null,
    };

    _mapContainer = null;
    _markers = {};

    constructor(props)
    {
        super(props);
        // this.extendState({
        // });
    }

    componentDidMount()
    {
        this.loadJs().then(() => {
            return this.createMapObject();
        }).then(() => {
            this.updateMarkers(this.props.markers);
        });
    }

    componentWillReceiveProps(props)
    {
        this.updateMarkers(props.markers);
    }

    getMapUrl()
    {
        const key = Meteor.settings.public['google-maps_key'];
        return `https://maps.googleapis.com/maps/api/js?v=3&key=${key}&libraries=geometry,drawing,places&language=de`;
    }

    getMap()
    {
        return this._map;
    }

    onMarkerDragEnd(code)
    {
        const pos = this._markers[code].ref.getPosition();
        const nPos = {lat: pos.lat(), lng: pos.lng()};
        this._markers[code].location = nPos;
        
        if (_.isFunction(this.props.onMarkerDrag))
        {
            this.props.onMarkerDrag(code, {
                latitude: nPos.lat,
                longitude: nPos.lng,
            });
        }
    }

    updateMarkers(markers)
    {
        if (_.isArrayNotEmpty(markers))
        {
            // var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
            // icon: image

            markers.forEach((marker) => {
                if (marker.code in this._markers)
                {
                    const prev = this._markers[marker.code];
                    if (prev.location.lat !== marker.location.lat || prev.location.lng !== marker.location.lng)
                    {
                        // update
                        prev.ref.setPosition(marker.location);
                        prev.location = marker.location;

                        // this._map.panTo( marker.location );
                        // this._map.setCenter(m.getPosition());
                    }
                }
                else
                {
                    const ref = new google.maps.Marker({
                        position: marker.location,
                        map: this._map,
                        draggable: true,
                    });
                    ref.addListener('dragend', this.onMarkerDragEnd.bind(this, marker.code));

                    this._markers[marker.code] = {
                        location: _.clone(marker.location),
                        ref,
                    };
                }

                // todo: remove absent
                // marker.setMap(null);
            });
        }
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
        });
    }

    loadJs() {
        return Util.loadJs(this.getMapUrl());
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
