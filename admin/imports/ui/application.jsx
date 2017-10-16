import React from 'react';
import Application from '../lib/base/application/application.jsx';
import DefaultLayout from './component/application-layout/default/index.jsx';

import HomePage from './page/home/index.jsx';
import NotFoundPage from './page/404/index.jsx';
import NotAuthorizedPage from './page/401/index.jsx';
import LoginPage from './page/login/index.jsx';
import TaskRunnerPage from './page/task-runner/index.jsx';

import EntityMap from '../startup/client/entity-map.js';

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

    render() {
        // main is actually the page controller specified in the route declaration
        const {main, routeProps} = this.props;

        // if we use accounts and we are waiting for user data from the database,
        // we render as null to avoid unnecessary code to run
        if (this.useAccounts() && this.props.waitUserData)
        {
            return null;
        }

        let Layout = DefaultLayout;
        if ('layout' in routeProps)
        {
            Layout = routeProps.layout ? routeProps.layout : 'div';
        }

        return (
            <div
                className="application"
                ref={(ref) => { this._appContainer = ref; }}
            >
                <Layout className="application__layout">
                    {
                        React.createElement(main, this.transformPageParameters({
                            route: routeProps,
                        }))
                    }
                </Layout>
                {this.renderExtras()}
            </div>
        );
    }
}
