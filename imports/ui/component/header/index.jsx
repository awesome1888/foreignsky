/* eslint-disable class-methods-use-this */

import React from 'react';

import './style.less';

export default class Header extends React.Component {

	// logic here

	render()
	{
		return (
			<div className="header">
				<div className="header__inner">
					<div className="header__logo">
						<div className="header__logo-img">
							B_
						</div>
						<div className="header__logo-text">
							Nach Berlin!
							<div className="header__logo-funny-desc">
								Ну или просто еще один блог одной IT-семьи, решившей переехать в Берлин
							</div>
						</div>
					</div>
					{/*<div className="header__buttons">*/}
						{/*<div className="button button-tag">*/}
							{/*О нас*/}
						{/*</div>*/}
						{/*<div className="button button-tag">*/}
							{/*Контакты*/}
						{/*</div>*/}
					{/*</div>*/}
				</div>
				<div className="header__loading-bar">

				</div>
			</div>
		);
	}
}