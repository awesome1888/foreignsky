import React from 'react';
import Application from '../lib/base/application/application.jsx';

export default class extends Application {

	constructor(props)
	{
		super(props);

		this._idioticMessage = this.generateMOTD();
	}

    generateMOTD()
    {
        return _.sample([
            'This is my panel, I am The Admin, I do what I want!',
            'Uncorns sucks! I mean it!',
            'Do some good today. Or die. Whatever.',
            'This is only hard-coded text, and soon there will be more!',
            'Do not underestimate unpredictable idiots around.',
            'Man, get some sleep already!',
            'Тут будет менюшечка, ну а пока - захардкоженные ссылочки',
        ]);
    }

    transformPageParameters(params)
    {
        const params = super.transformPageParameters(params);
        params.motd = this._idioticMessage;

        return params;
    }
}
