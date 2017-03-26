/* eslint-disable class-methods-use-this */

import React from 'react';
import {GoogleMap, Marker} from 'react-google-maps';
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";

import './style.less';

export default class ArticleViewer extends React.Component {
	render(props = {})
	{
		props.containerElementProps = props.containerElementProps || {};
		props.markers = props.markers || [];

		return (
			<div className="another-stupid-wrapper">
				<div className="article-panel">
					<div className="article-panel__filter">
						<div className="article-panel__filter-search">
						    <input className="input article-panel__filter-input" type="text" placeholder="Искать статью" />
						</div>
						<div className="article-panel__filter-button-set">
							<div className="button button-tag article-panel__filter-button">
								# Быт
							</div>
							<div className="button button-tag article-panel__filter-button">
								# Место
							</div>
							<div className="button button-tag article-panel__filter-button">
								# Событие
							</div>
						</div>
					</div>
					<div className="article-panel__list">
						<div className="article-panel__list__inner">
							<a href="/100" className="article-panel__list__item">
								Про парковку
							</a>
							<a href="/200" className="article-panel__list__item">
								Про наклейку на лобовое стекло машины
							</a>
							<a href="/200" className="article-panel__list__item">
								Воскресенье в Германии
							</a>
						</div>
					</div>
				</div>
				<div className="map-container" />
				{/*<ScriptjsLoader*/}

					{/*hostname={"maps.googleapis.com"}*/}
					{/*pathname={"/maps/api/js"}*/}
					{/*query={{*/}
						{/*v: '3',*/}
						{/*key: 'AIzaSyD2sbLti6b29JE3nZjUUk-LAav4BIH2vK0',*/}
						{/*libraries: "geometry,drawing,places"*/}
					{/*}}*/}
					{/*loadingElement={*/}
						{/*<div>*/}
							{/*Loading*/}
						{/*</div>*/}
					{/*}*/}
					{/*containerElement={*/}
						{/*<div className="map-container" />*/}
					{/*}*/}
					{/*googleMapElement={*/}
						{/*<GoogleMap*/}
							{/*ref={(map) => {this.map = map}}*/}
							{/*defaultZoom={14}*/}
							{/*defaultCenter={{ lat: 52.5252094, lng: 13.4125535 }}*/}
							{/*onClick={props.onMapClick}*/}
						{/*>*/}
							{/*{props.markers.map((marker, index) => {*/}
								{/*return (*/}
									{/*<Marker*/}
										{/*{...marker}*/}
										{/*onRightclick={() => props.onMarkerRightclick(index)} />*/}
								{/*);*/}
							{/*})}*/}
						{/*</GoogleMap>*/}
					{/*}*/}
				{/*/>*/}
			</div>
		);
	}
}