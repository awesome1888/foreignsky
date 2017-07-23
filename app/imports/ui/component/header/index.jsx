/* eslint-disable class-methods-use-this */

import React from 'react';

import './style.less';

export default class Header extends React.Component {

	static propTypes = {
		//appLoaded: PropTypes.boolean,
	};

	static defaultProps = {
		//appLoaded: false
	};

	render()
	{
		//const loading = this.props.appLoaded;

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
									Nach Berlin!
									<div className="header__logo-funny-desc">
										Ну или просто еще один блог одной IT-семьи, решившей переехать в Берлин
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