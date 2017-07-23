/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';

// tmp
import Article from '../../../api/article/entity/entity.client.js';
import Tag from '../../../api/article.tag/entity/entity.client.js';
import List from '../../component/general/list/list.jsx';

export default class HomePage extends BasePage
{
	render()
    {
        return (
            <Layout
                side={<div className="">
                    SIDE
                </div>}
                central={
                    <List
                        entity={Tag}
                    />
                }
            />
        );
    }
}
