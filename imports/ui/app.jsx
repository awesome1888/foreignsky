import React from 'react';

import Header from '/imports/ui/component/header/index.jsx';
import Map from '/imports/ui/component/map/index.jsx';

export default class App extends React.Component {

	render() {

		const {main, routeProps} = this.props;

		return (
			<div id="app">
				<div className="layout">
					<Header />
					{React.createElement(main, {
						route: routeProps,
						//user: user
					})}
				</div>
				<Map />
			</div>
		);
	}
}