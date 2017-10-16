/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

// import Layout from '../../component/layout/layout.jsx';

export default class NotAuthorizedPage extends BasePage
{
    getDefaultTitle()
    {
        return 'Not authorized';
    }

	render()
    {
        return (
            'Not authorized'
        );
    }
}
