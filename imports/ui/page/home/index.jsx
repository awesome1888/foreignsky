/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '/imports/ui/page/base/index';

import './style.less';

export default class HomePage extends BasePage {

	get html()
	{
		return (
			<div>
				Here we have beautiful google map
			</div>
		);
	}
}