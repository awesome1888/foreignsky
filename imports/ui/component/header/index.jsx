/* eslint-disable class-methods-use-this */

import React from 'react';
import HeaderLoader from '/imports/ui/component/header.loader/index.jsx';

import './style.less';

export default class Header extends React.Component {

	render()
	{
		return (
			<div className="layout__central layout__header">
				<div className="container">
					<div className="layout__central-row row">
						<div className="header col-xs-12">

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
						</div>
					</div>
				</div>
				<HeaderLoader />
			</div>
		);
	}
}