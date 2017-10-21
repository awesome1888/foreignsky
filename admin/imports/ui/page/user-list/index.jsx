/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';
import List from './component/list/list.jsx';

export default class UserListPage extends BasePage
{
	render()
    {
        console.dir('render user list');

        return (
            <Layout
                title={List.getEntity().getTitle()}
                central={
                    <List
                        detailPageUrl={this.props.route.detailPath || ''}
                    />
                }
            />
        );
    }
}
