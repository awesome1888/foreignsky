/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';
import MapFullLayout from '../../component/layout/map-full/map-full.jsx';

import ShellUI from '../../../lib/util/shell/ui/ui.jsx';

export default class ShellPage extends BasePage
{
	render()
	{
		return (
            <MapFullLayout
                className="margin-top_5"
                central={
                    <div className="background-color_white scroll_vertical">
                        <ShellUI />
                    </div>
                }
            />
		);
	}
}
