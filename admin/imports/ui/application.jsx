import React from 'react';
import Application from '../lib/base/application/application.jsx';

import HomePage from './page/home/index.jsx';
import NotFoundPage from './page/404/index.jsx';
import TaskRunnerPage from './page/task-runner/index.jsx';

import EntityMap from '../startup/client/entity-map.js';

import Header from './component/header/index.jsx';
import LoadOverlay from './component/load-overlay/index.jsx';
import LoadIndicator from './component/load-indicator/index.jsx';

import Naviation from './component/navigation/navigation.jsx';

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

        // todo: probably move this function to event-based pattern

        // static
        routes.push({
            path: '/task-runner',
            controller: TaskRunnerPage,
        });

        // entity
        this.loadEntityRouteMap(routes);

        // todo: add more routes here...

        return routes;
    }

    static loadEntityRouteMap(routes)
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

                Object.values(item.route).forEach((path) => {

                    routes.push({
                        path: this.transformPath(path.path),
                        controller: path.controller,
                        params,
                    });

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
        this.setState({
            title,
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
        const {main, routeProps} = this.props;

        return (
            <div className="layout">
                {
                    this.showOverlay()
                    &&
                    <LoadOverlay
                        ref={(instance) => {this.setOverlay(instance)}}
                    />
                }

                <Header />
                {
                    this.showIndicator()
                    &&
                    <LoadIndicator
                        ref={(instance) => {this.setIndicator(instance)}}
                    />
                }

                <div className="ui container">
                    <div className="ui equal width grid">
                        <div className="row">
                            <div className="
                                computer only
                                tablet only
                                column
                            ">
                                <Naviation
                                    className="margin-bottom"
                                />
                            </div>
                            <div className="
                                twelve wide computer
                                twelve wide tablet
                                sixteen wide mobile
                                siz
                                column
                            ">
                                {
                                    React.createElement(main, this.transformPageParameters({
                                        route: routeProps,
                                    }))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderExtras()}
            </div>
        );
    }
}
