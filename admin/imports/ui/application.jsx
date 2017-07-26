import React from 'react';
import Application from '../lib/base/application/application.jsx';

import HomePage from './page/home/index.jsx';
import NotFoundPage from './page/404/index.jsx';
import TaskRunnerPage from './page/task-runner/index.jsx';

import EntityMap from '../startup/client/entity-map.js';

export default class AdminApplication extends Application
{
    static getHomePageController()
    {
        return HomePage;
    }

    static get404PageController()
    {
        return NotFoundPage;
    }

    static getRouteMap()
    {
        const routes = super.getRouteMap();

        routes.push({
            path: '/task-runner',
            controller: TaskRunnerPage,
        });

        EntityMap.getRouteMap().forEach((item) => {
            routes.push(item);
        });

        // todo: add more routes here...
        
        return routes;
    }

	constructor(props)
	{
		super(props);
		this.extendState({
            title: this.makeTitle(),
        });

		this._idioticMessage = this.generateMOTD();
	}

    setTitle(title = '')
    {
        super.setTitle(title);
        this.setState({
            title,
        });
    }

    generateMOTD()
    {
        return _.sample([
            'This is my panel, I am The Admin, I do what I want! Agggrrrrhhhh!!!',
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
        const tParams = super.transformPageParameters(params);
        tParams.motd = this._idioticMessage;
        tParams.title = this.state.title;

        return tParams;
    }
}
