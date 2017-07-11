/* eslint-disable class-methods-use-this */

import React from 'react';
import Article from '../../../api/article/entity/entity.client.js';

export default class DemoPage extends React.Component {
    render()
    {
        Article.test();

        const a = new Article();
        a.test();

        return (<div>Rendered</div>);
    }
}
