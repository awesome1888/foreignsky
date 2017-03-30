/* eslint-disable class-methods-use-this */

import React from 'react';

import './style.less';

export default class HeaderLoader extends React.Component {

	// logic here

	render()
	{
		return (
			<div className="header__loading-bar">
				<div className="header__loading-bar-progress" />
			</div>
		);
	}
}