import React from 'react';

import Header from '/imports/ui/component/header/index.jsx';

export default class App extends React.Component {

	render() {

		const {main, routeProps} = this.props;

		return (
			<div id="app">
				<Header />
				{React.createElement(main, {
					route: routeProps,
					//user: user
				})}
			</div>
		);
	}
}