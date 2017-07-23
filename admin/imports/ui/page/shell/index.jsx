/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';
import ShellUI from '../../../lib/util/shell/ui/ui.jsx';

export default class extends BasePage
{
	render()
    {
        return (
            <Layout
                central={
                    <ShellUI />
                }
            />
        );
    }
}
