/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';

import 'semantic-ui-css/semantic.min.css';
import { Button } from 'semantic-ui-react';

export default class HomePage extends BasePage
{
	render()
    {
        return (
            <Layout
                title={this.props.title}
                motd={this.props.motd}
                central={
                    <div className="">
                        <Button>
                            Click Here
                        </Button>
                    </div>
                }
            />
        );
    }
}
