/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import ShellUI from '../../../lib/util/shell/ui/ui.jsx';

export default class ShellPage extends BasePage
{
	render()
	{
		return (
			<div className="home__central everest background_white padding">
				<ShellUI />
			</div>
		);
	}
}
