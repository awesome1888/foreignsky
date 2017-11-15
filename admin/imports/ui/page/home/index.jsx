/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';
import Form from '../../component/general/form/form.jsx';

export default class HomePage extends BasePage
{
    getPageTitle()
    {
        return 'Home';
    }

	render()
    {
        return (
            <Layout
                title={this.getPageTitle()}
                central={
                    <div className="">
                        What do you want to do?
                    </div>
                }
            />
        );
    }
}
