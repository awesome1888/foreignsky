import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

export default class App extends Component {

	render() {

		const {main, routeProps} = this.props;

		return (
			<div id="app">
				{React.createElement(main, {
					route: routeProps,
					//user: user
				})}
			</div>
		);
	}
}

// export default createContainer(props => ({
// 	user: Meteor.user(),
// 	isLoggingIn: Meteor.loggingIn(),
// 	...props
// }), App);