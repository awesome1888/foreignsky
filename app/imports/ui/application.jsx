import React from 'react';

import HomePage from '../ui/page/home/index.jsx';
import NotFoundPage from './page/404/index.jsx';
import PrivacyPolicyPage from './page/privacy-policy/index.jsx';

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

        routes['privacy-policy'] = {
            path: '/privacy-policy',
            controller: PrivacyPolicyPage,
        };

        routes['article'] = {
            path: '/:id',
            controller: HomePage,
        };

        return routes;
    }
}
