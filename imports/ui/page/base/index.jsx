/* eslint-disable class-methods-use-this */

import React from 'react';
import DocumentMeta from 'react-document-meta';

export default class BasePage extends React.Component {

	get meta()
	{
		return  {
			title: 'InDaBerlin',
			description: 'You can find here a lot of cool stuff',
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

	getCentralHtml(props)
	{
		return ('');
	}

	getSideHtml(props)
	{
		return ('');
	}

	render(props)
	{
		return (
			<div className="layout">
				<DocumentMeta {...this.meta} />
				<div className="layout__central layout__central-body container">
					<div className="layout__central-row row">
						<div className="layout__central-body-left col-xs-3">
							{this.getSideHtml(props)}
						</div>
						<div className="layout__central-body-right col-xs-9">
							<div className="layout__central-body-right-scroll">
								{this.getCentralHtml(props)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}