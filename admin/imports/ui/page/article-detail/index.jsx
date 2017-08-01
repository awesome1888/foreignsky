/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';
import Form from './component/form/form.jsx';

export default class ArticleDetailPage extends BasePage
{
    render()
    {
        return (
            <Layout
                title={this.props.title}
                motd={this.props.motd}
                central={
                    <Form
                        detailPageUrl={this.props.route.detailPath || ''}
                    />
                }
            />
        );
    }
}
