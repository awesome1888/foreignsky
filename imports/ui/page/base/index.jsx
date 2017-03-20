/* eslint-disable class-methods-use-this */

import React from 'react';
import DocumentMeta from 'react-document-meta';

export default class BasePage extends React.Component {

	get meta()
	{
		return  {
			title: 'InDaBerlin',
			description: 'You can find there a lot of cool stuff',
			//canonical: 'http://example.com/path/to/page',
			meta: {
				charset: 'utf-8',
				name: {
					keywords: 'berlin,blackjack,whores',
					viewport: 'initial-scale=1.0, user-scalable=no'
				}
			}
		};
	}

	get html()
	{
		return ('');
	}

	render()
	{
		return (
			<div>
				<DocumentMeta {...this.meta} />
				{this.html}
			</div>
		);
	}
}