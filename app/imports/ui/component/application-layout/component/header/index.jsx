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
								    title="Однажды тут будет красивый логотип"
								>
									B_
								</a>
								<div className="header__logo-text">
                                    Дождь и готика
									<div className="header__logo-funny-desc">
										Блог семьи, переехавшей в Германию
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
