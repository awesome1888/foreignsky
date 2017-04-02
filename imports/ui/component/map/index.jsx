/* eslint-disable class-methods-use-this */

import React from 'react';
import {GoogleMap, Marker} from 'react-google-maps';
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";

import './style.less';

export default class Map extends React.Component {

	constructor(params)
	{
		super(params);
		this.useFakeMap = false;
		this.map = null;
	}

	render(props = {})
	{
		props.containerElementProps = props.containerElementProps || {};
		props.markers = props.markers || [];

		return (
			<div className="map-wrapper">
				{
					this.useFakeMap
					&&
					[
						<div className="map-container" />,
						<a className="test">LALALA</a>
					]
				}

				{
					!this.useFakeMap
					&&
					<ScriptjsLoader
						hostname={"maps.googleapis.com"}
						pathname={"/maps/api/js"}
						query={{
							v: '3',
							key: 'AIzaSyD2sbLti6b29JE3nZjUUk-LAav4BIH2vK0',
							libraries: "geometry,drawing,places"
						}}
						loadingElement={
							<div>
								Loading
							</div>
						}
						containerElement={
							<div className="map-container" />
						}
						googleMapElement={
							<GoogleMap
								ref={(map) => {this.map = map}}
								defaultZoom={14}
								defaultCenter={{ lat: 52.5252094, lng: 13.4125535 }}
								onClick={props.onMapClick}
							>
								{
									props.markers.map((marker, index) => {
										return (
											<Marker
												{...marker}
												onRightclick={() => props.onMarkerRightclick(index)}
											/>
										);
									})
								}
							</GoogleMap>
						}
					/>
				}
			</div>
		);
	}
}