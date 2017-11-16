/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';

export default class NotFoundPage extends BasePage
{
    getPageTitle()
    {
        return '404';
    }

	render()
    {
        return (
            <Layout
                title={this.getPageTitle()}
                central={"Page not found (404)"}
            />
        );
    }
}
