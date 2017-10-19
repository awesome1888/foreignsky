import React from 'react';
import Application from '../lib/base/application/application.jsx';
import DefaultLayout from './component/application-layout/default/index.jsx';

import HomePage from './page/home/index.jsx';
import NotFoundPage from './page/404/index.jsx';
import NotAuthorizedPage from './page/401/index.jsx';
import ForbiddenPage from './page/403/index.jsx';
import LoginPage from './page/login/index.jsx';
import TaskRunnerPage from './page/task-runner/index.jsx';

import EntityMap from '../startup/client/entity-map.js';
import Security from '../lib/util/security/security.client.js';

export default class AdminApplication extends Application
{
    static useAccounts()
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

    static get401PageController()
    {
        return NotAuthorizedPage;
    }

    static get403PageController()
    {
        return ForbiddenPage;
    }

    static getLoginPageController()
    {
        return LoginPage;
    }

    static getDefaultApplicationLayoutController()
    {
        return DefaultLayout;
    }

    static getRouteMap()
    {
        const routes = super.getRouteMap();

        this.attachEntityRoutes(routes);

        routes['task-runner'] = {
            path: '/task-runner',
            controller: TaskRunnerPage,
            params: {
                security: this.getDefaultPageSecurityPolicy(),
            },
        };
        
        return routes;
    }

    static getDefaultPageSecurityPolicy()
    {
        return Security.getAdminCondition();
    }

    ///////////////////////////////////////////////////

    static attachEntityRoutes(routes)
    {
        return EntityMap.forEach((item) => {
            if (_.isObjectNotEmpty(item.route))
            {
                const params = {
                    security: Security.getAdminCondition(),
                };
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

    /**
     * todo: get rid of this crap
     * @param path
     * @returns {string}
     */
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
}
