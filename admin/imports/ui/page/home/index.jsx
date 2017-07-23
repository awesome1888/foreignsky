/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';

// tmp
import Article from '../../../api/article/entity/entity.client.js';

export default class HomePage extends BasePage
{
	render()
    {
        Article.findOne().then((res) => {
            console.dir(res);
            console.dir(res.collection);
        });

        return (
            <Layout
                side={'SIDE'}
                central={
                    <div>Hello there</div>
                }
            />
        );
    }
}
