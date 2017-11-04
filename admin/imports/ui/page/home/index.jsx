/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';
import Form from '../../component/general/form/form.jsx';

export default class HomePage extends BasePage
{
    getDefaultTitle()
    {
        return 'Home';
    }

	render()
    {
        return (
            <Layout
                title={this.getDefaultTitle()}
                central={
                    <div className="">
                        What to you want to do?
                    </div>
                }
            />
        );
    }
}
