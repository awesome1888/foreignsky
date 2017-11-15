/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';
import ShellUI from '../../../lib/util/shell/ui/ui.jsx';

export default class TaskRunnerPage extends BasePage
{
    getPageTitle()
    {
        return 'Task runner';
    }

	render()
    {
        return (
            <Layout
                title={this.getPageTitle()}
                central={
                    <ShellUI />
                }
            />
        );
    }
}
