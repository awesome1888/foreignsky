/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';
import List from './component/list/list.jsx';

import Modal from '../../component/general/modal/index.js';

export default class TestEntityListPage extends BasePage
{
	render()
    {
        return (
            <Layout
                title={this.props.title}
                motd={this.props.motd}
                central={
                    <List
                        detailPageUrl={this.props.route.detailPath || ''}
                    />
                }
            />
        );
    }
}
