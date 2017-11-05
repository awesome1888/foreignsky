import React from 'react';

import HomePage from '../ui/page/home/index.jsx';
import NotFoundPage from '../ui/page/not-found/index.jsx';

import Application from '../lib/base/application/application.jsx';
import DefaultLayout from './component/application-layout/default/index.jsx';

export default class FrontApplication extends Application
{
    static getHomePageController()
    {
        return HomePage;
    }

    static get404PageController()
    {
        return NotFoundPage;
    }

    static getDefaultApplicationLayoutController()
    {
        return DefaultLayout;
    }

    static getRouteMap()
    {
        const routes = super.getRouteMap();

        routes['article'] = {
            path: '/:id',
            controller: HomePage,
        };

        return routes;
    }

    getMainTitle()
    {
        return 'Nachberlin';
    }

    getGlobalSelectorMap()
    {
        return [
        {
            selector: '[data-open-image="true"]',
                callback: () => {
                    console.dir('hello there!');
                    console.dir(arguments);
                },
            },
        ];
    }
}
