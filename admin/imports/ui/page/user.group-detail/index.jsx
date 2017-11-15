/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';
import Form from './component/form/form.jsx';

export default class UserGroupDetailPage extends BasePage
{
    getPageTitle()
    {
        return Form.getEntity().getTitle();
    }

    render()
    {
        const backUrl = this.props.route.listPath || '';

        // todo: better parse ID from the current path according to detailPath, but
        // todo: not rely on FlowRouter behaviour
        return (
            <Layout
                title={this.getPageTitle()}
                backUrl={backUrl}
                central={
                    <Form
                        id={this.props.route.id}
                        backPath={backUrl}
                    />
                }
            />
        );
    }
}
