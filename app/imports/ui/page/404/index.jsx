/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import './style.less';

export default class NotFoundPage extends BasePage
{
    getPageTitle()
    {
        return '404';
    }

	render()
	{
		return (<div>No such page. 404. I mean it.</div>);
	}
}
