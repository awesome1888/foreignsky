/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '/imports/ui/page/base/index';
import {GoogleMapLoader, GoogleMap, Marker} from 'react-google-maps';
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";

import './style.less';

export default class HomePage extends BasePage {

	constructor(params)
	{
		super(params);
		this.map = null;
	}

	getHtml(props = {})
	{
		props.containerElementProps = props.containerElementProps || {};
		props.markers = props.markers || [];

		return (
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
						defaultZoom={3}
						defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
						onClick={props.onMapClick}
					>
						{props.markers.map((marker, index) => {
							return (
								<Marker
									{...marker}
									onRightclick={() => props.onMarkerRightclick(index)} />
							);
						})}
					</GoogleMap>
				}
			/>
		);
	}
}