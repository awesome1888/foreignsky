/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

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
            <div>Hello there</div>
        );
    }
}
