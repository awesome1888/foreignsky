import React from 'react';
import Application from '../lib/base/application/application.jsx';

import HomePage from './page/home/index.jsx';
import NotFoundPage from './page/404/index.jsx';
import LoginPage from './page/login/index.jsx';
import TaskRunnerPage from './page/task-runner/index.jsx';

import EntityMap from '../startup/client/entity-map.js';

export default class AdminApplication extends Application
{
    static enableUserAccounts()
    {
        return true;
    }

    static getHomePageController()
    {
        return HomePage;
    }

    static get404PageController()
    {
        return NotFoundPage;
    }

    static getLoginPageController()
    {
        return LoginPage;
    }

    static getRouteMap()
    {
        const routes = super.getRouteMap();
        this.attachEntityRoutes(routes);

        routes['task-runner'] = {
            path: '/task-runner',
            controller: TaskRunnerPage,
        };
        
        return routes;
    }

    ///////////////////////////////////////////////////

    static attachEntityRoutes(routes)
    {
        return EntityMap.forEach((item) => {
            if (_.isObjectNotEmpty(item.route))
            {
                const params = {};
                if (item.route.list)
                {
                    params.listPath = item.route.list.path;
                }
                if (item.route.detail)
                {
                    params.detailPath = item.route.detail.path;
                }

                _.forEach(item.route, (path, key) => {
                    routes[item.entity.getUniqueCode()+'_'+key] = {
                        path: this.transformPath(path.path),
                        controller: path.controller,
                        params,
                    };
                });
            }
        });
    }

    static transformPath(path)
    {
        if (_.isStringNotEmpty(path))
        {
            return path.replace('#ID#/', ':id');
        }

        return '';
    }

	constructor(props)
	{
		super(props);
		this.extendState({
            title: this.makeTitle(),
        });
	}

    setTitle(title = '')
    {
        super.setTitle(title);
    }

    getMainTitle()
    {
        return 'Admin';
    }

    transformPageParameters(params)
    {
        const tParams = super.transformPageParameters(params);
        tParams.title = this.state.title;

        return tParams;
    }

    render() {
        const {main, routeProps} = this.props;

        return (
            <div
                className="application"
                ref={(ref) => { this._appContainer = ref; }}
            >
                {
                    React.createElement(main, this.transformPageParameters({
                        route: routeProps,
                    }))
                }
                {this.renderExtras()}
            </div>
        );
    }
}
