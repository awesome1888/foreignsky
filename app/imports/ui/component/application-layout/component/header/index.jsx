/* eslint-disable class-methods-use-this */

import React from 'react';

import './style.less';

export default class Header extends React.Component {
	render()
	{
		return (
			<div className="container">
				<div className="layout__central-row row">
					<div className="header col-xs-12">
						<div className="header__inner">
							<div className="header__logo">
								<a
									href="/"
									className="header__logo-img"
								/>
								<div className="header__logo-text">
                                    <div className="header__logo-title">
                                        Чужое небо
                                    </div>
									<div className="header__logo-subtitle">
										Блог одной русской семьи, переехавшей в Германию
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
