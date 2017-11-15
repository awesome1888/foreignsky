/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';
import List from './component/list/list.jsx';

export default class EmbedListPage extends BasePage
{
    getPageTitle()
    {
        return List.getEntity().getTitle();
    }

	render()
    {
        return (
            <Layout
                title={this.getPageTitle()}
                central={
                    <List
                        detailPageUrl={this.props.route.detailPath || ''}
                    />
                }
            />
        );
    }
}
