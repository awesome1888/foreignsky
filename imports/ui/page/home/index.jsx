/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '/imports/ui/page/base/index';
import ArticleViewer from '/imports/ui/component/article.viewer/index.jsx';

export default class HomePage extends BasePage {

	constructor(params)
	{
		super(params);
		this.map = null;
	}

	getHtml()
	{
		return (
			<div className="another-stupid-wrapper">
				<ArticleViewer />
			</div>
		);
	}
}