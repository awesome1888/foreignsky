/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import './style.less';

export default class PrivacyPolicyPage extends BasePage
{
    getPageTitle()
    {
        return 'Согласие на обработку персональных данных';
    }

	render()
	{
		return (
            <div
                className="article-detail page-content"
            >
                <div className="article-detail__inner-scroll">
                    <div className="padding_x">
                        <h1>Политика конфиденциальности и согласие на обработку персональных данных</h1>
                    </div>
                </div>
            </div>
        );
	}
}
