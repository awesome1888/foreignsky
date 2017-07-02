/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '/imports/ui/page/base/index';

import ShellUI from '../../../lib/util/shell/ui/ui.jsx';

export default class ShellPage extends BasePage {
	getCentralHtml()
	{
		return (
			<div className="home__central everest background_white padding">
				<ShellUI />
			</div>
		);
	}
}
