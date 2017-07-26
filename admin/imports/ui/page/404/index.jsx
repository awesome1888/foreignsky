/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';

export default class NotFoundPage extends BasePage
{
	render()
    {
        return (
            <Layout
                title={this.props.title}
                motd={this.props.motd}
                central={
                    ('Ничего не найдено, все сперли. 404')
                }
            />
        );
    }
}
