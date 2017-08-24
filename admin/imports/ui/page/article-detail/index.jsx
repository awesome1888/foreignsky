/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';
import Form from './component/form/form.jsx';

export default class ArticleDetailPage extends BasePage
{
    render()
    {
        // todo: better parse ID from the current path according to detailPath, but
        // todo: not rely on FlowRouter behaviour

        return (
            <Layout
                title={this.props.title}
                motd={this.props.motd}
                central={
                    <div className="">
                        <Form
                            id={this.props.route.id}
                            backPath={this.props.route.listPath || ''}
                        />
                        <br />
                        <br />
                    </div>
                }
            />
        );
    }
}
