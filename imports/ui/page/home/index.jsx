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
			<div className="another-stupid-wrapper">
				<div className="article-panel">
					<div className="article-panel__filter">
						<div className="article-panel__filter__button-set">
							<div className="button button-tag">
								# Быт
							</div>
							<div className="button button-tag">
								# Место
							</div>
							<div className="button button-tag">
								# Событие
							</div>
						</div>
					</div>
					<div className="article-panel__list">
						<div className="article-panel__list__inner">
						    <div className="article-panel__list__item">
								Item Item!!!
						    </div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
							<div className="article-panel__list__item">
								Item Item!!!
							</div>
						</div>
					</div>
				</div>
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
			</div>
		);
	}
}