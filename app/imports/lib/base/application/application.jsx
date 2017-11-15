import React from 'react';
import Util from '../../util.js';
import BaseComponent from '../component/component.jsx';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {createRouter} from 'meteor/cultofcoders:meteor-react-routing';
import {createContainer} from 'meteor/react-meteor-data';
import Security from '../../util/security/security.client.js';
import SecurityProvider from '../../util/security/provider.js';
import ConsoleOutput from '../../util/console-output/index.js';

import Accounts from './accounts/index.js';

export default class Application extends BaseComponent
{
    static _router = null;
    static _instance = null;
    static _routerController = null;

    /**
     * Application initialization entry point
     */
    static init()
    {
        if (this.useAccounts())
        {
            // create reactive container to track the moment when we got authorized
            this._routerController = this.makeContainer();
        }
        else
        {
            // if we dont use accounts, make it simpler
            this._routerController = this;
        }

        this.registerRoutes();
    }

    static makeContainer()
    {
        return createContainer((props) => {
            return {
                waitUserData: Meteor.loggingIn(),
                ...props,
            };
        }, this);
    }

    /**
     * Switch to true if you plan to use user accounts (authorization)
     * @returns {boolean}
     */
    static useAccounts()
    {
        return false;
    }

    /**
     * Function declares routes for the router. Override with inheritance
     * @returns {{}}
     */
    static getRouteMap()
    {
        const routes = {
            home: {
                path: '/',
                controller: this.getHomePageController(),
                params: {
                    security: this.getDefaultPageSecurityPolicy(),
                },
            },
            404: {
                path: '/404',
                controller: this.get404PageController(),
                params: {},
            },
        };

        if (this.useAccounts())
        {
            this.attachUserAccountRoutes(routes);
        }

        return routes;
    }

    ///////////////////////////////////////////////////

    static getRouterFunction()
    {
        if (this._router === null)
        {
            // creating new router over the container created over the application
            this._router = createRouter(this._routerController);
        }

        return this._router;
    }

    static addRoute(path, controller = null, controllerParams = {}, options = {})
    {
        options.triggersEnter = [];

        options.triggersEnter.push((context, doRedirect, doStop) => {

            ConsoleOutput.dir(`Going to ${path}`);
            this.fire('router-go', [context.path]);

            if (this.useAccounts())
            {
                // move all unauthorized to /login
                if (!Accounts.isUserAuthorized() && context.path !== '/login')
                {
                    doRedirect('/login');
                }
            }
        });

        if (controller)
        {
            this.getRouterFunction()(path, controller, controllerParams, options);
        }
        else
        {
            FlowRouter.route(path, options);
        }
    }

    static getHomePageController()
    {
        throw new Error('Not implemented: static getHomePageController()');
    }

    static get404PageController()
    {
        throw new Error('Not implemented: static get404PageController()');
    }

    static get403PageController()
    {
        throw new Error('Not implemented: static get403PageController()');
    }

    static getLoginPageController()
    {
        throw new Error('Not implemented: static getLoginPageController()');
    }

    static getDefaultApplicationLayoutController()
    {
        throw new Error('Not implemented: static getDefaultApplicationLayoutController()');
    }

    static attachUserAccountRoutes(routes)
    {
        Object.assign(routes, {
            403: {
                path: '/403',
                controller: this.get403PageController(),
                params: {},
            },
            login: {
                path: '/login',
                controller: this.getLoginPageController(),
                params: {
                    layout: null,
                },
            },
            logout: {
                path: '/logout',
                options: {
                    action: () => {
                        Meteor.logout(() => {
                            FlowRouter.go('/login');
                        });
                    },
                },
            },
        });
    }

    static registerRoutes()
    {
        this.prepareRouter();

        Object.values(this.getRouteMap()).forEach((route) => {
            this.addRoute(route.path, route.controller, route.params || {}, route.options || {});
        });
    }

    static prepareRouter()
    {
        // attach default 404 action
        FlowRouter.notFound = {
            action: function() {
                FlowRouter.go('/404');
            }
        };

        if (this.needPostponeRouterInit())
        {
            // we need to wait for accounts to get ready...
            FlowRouter.wait();
            Tracker.autorun((c) => {
                if (FlowRouter._initialized)
                {
                    return;
                }

                if (this.areRouterConditionsReady())
                {
                    c.stop();
                    FlowRouter.initialize();
                    this.actAfterRouterReady();
                }
            });
        }
        else
        {
            this.actAfterRouterReady();
        }
    }

    static needPostponeRouterInit()
    {
        return this.useAccounts();
    }

    static areRouterConditionsReady()
    {
        if (this.useAccounts())
        {
            return Accounts.isSubscriptionReady();
        }

        return true;
    }

    /**
     * Executes additional actions after the router is ready
     */
    static actAfterRouterReady()
    {
    }

    /**
     * @returns {*}
     */
    static getInstance()
    {
        if(this._instance)
        {
            return this._instance;
        }

        return null;
    }

    /**
     * Inform the application that we are waiting for some promise. Application may show some loaders at the moment.
     * todo: update this..., move logic from the global loader here, fire two events: 'load-start', 'load-end'
     * @param p
     * @returns {*}
     */
    static wait(p)
    {
        return this.getInstance().wait(p);
    }

    _appContainer = null;
    _lastRouteChecked = null;

    constructor(props)
    {
        super(props);
        this.extendState(Object.assign({
        }, this.getAccountInitialState()));

        if (this.useAccounts())
        {
            this.on('router-go', this.onRouteChange.bind(this));
        }

        window.__application = this;
    }

    getGlobalSelectorMap()
    {
        return [
//         {
//             selector: '[data-save-scroll="true"]',
//             callback: () => {
//                 console.dir('hello there!');
//             },
//         },
        ];
    }

    componentWillMount()
    {
        this.constructor._instance = this;

        if (this.useAccounts())
        {
            this.processSecurity();
        }
    }

    // componentDidMount()
    // {
    //     /**
    //      * Have to use native JS to avoid problems with FlowRouter when clicking on href-s.
    //      * We use capturing to prevent being affected with cancelBubble.
    //      */
    //     if (this._appContainer && _.isArrayNotEmpty(this.getGlobalSelectorMap()))
    //     {
    //         this.onGlobalClick = this.onGlobalClick.bind(this);
    //         this._appContainer.addEventListener('click', this.onGlobalClick, true);
    //     }
    // }

    componentWillReceiveProps(props)
    {
        if (this.useAccounts())
        {
            this.processSecurity();

            if (!props.waitUserData)
            {
                // resolve user data promise
                this.getAccountController().informAccountsReady();
            }
        }
    }

    /**
     * That will never happen, but anyway :)
     */
    componentWillUnMount()
    {
        if (this._appContainer)
        {
            this._appContainer.removeEventListener('click', this.onGlobalClick, true);
        }
    }

    onRouteChange()
    {
        // console.dir('Reset last route');
        // this.setState({
        //     lastRoute: null,
        // });
    }

    processSecurity()
    {
        this.wait(this.getAccountController().waitData()).then(() => {
            this.setState({
                allAccountDataReady: true,
            });

            this.maybeCheckAccess(() => {
                this.maybeRouteToError();
            });
        });
    }

    maybeCheckAccess(cb)
    {
        const cPath = FlowRouter.current().path;

        if (this._lastRouteChecked !== cPath)
        {
            this._lastRouteChecked = cPath;
            this.setState({
                accessCheckResult: this.getAccessCheckResult(),
            }, () => {
                if (_.isFunction(cb))
                {
                    cb();
                }
            });
        }
    }

    getAccountController()
    {
        if (!this._accountController)
        {
            this._accountController = new Accounts(this);
        }

        return this._accountController;
    }

    /**
     * Returns the default security rules for a path. It can provide either
     * specially formatted object or a custom callback
     * @returns {{}|null}
     */
    static getDefaultPageSecurityPolicy()
    {
        return SecurityProvider.getOpenGatePolicy();
    }

    onGlobalClick(e)
    {
        let node;
        this.getGlobalSelectorMap().forEach((item) => {
            node = Util.findClosestParent(e.target, item.selector);
            if (node) {
                item.callback(node);
            }
        });
    }

    getQuery()
    {
        return FlowRouter.current().queryParams;
    }

    wait(p)
    {
        // inform possible overlays and progress bars that we have the promise to wait for
        this.fire('wait', [p]);
        return p;
    }

    getRouter()
    {
    }

    transformPageParameters(params)
    {
        return params;
    }

    getRouteProps()
    {
        return this.props.routeProps || {};
    }

    useAccounts()
    {
        return this.constructor.useAccounts();
    }

    getAccountInitialState()
    {
        return {
            allAccountDataReady: false,
            accessCheckResult: null,
        };
    }

    getAccessCheckResult()
    {
        return Security.testUserCurrent(this.getRouteProps().security);
    }

    maybeRouteToError()
    {
        if (this.useAccounts())
        {
            const code = this.state.accessCheckResult;

            if (code && code !== 200)
            {
                if (code === 401)
                {
                    FlowRouter.go('/login');
                }
                else
                {
                    FlowRouter.go(`/${code}`);
                }
            }
        }
    }

    userDataReady()
    {
        return !this.props.waitUserData;
    }

    accountsReady()
    {
        if (!this.useAccounts())
        {
            return true;
        }

        return this.userDataReady() && this.state.allAccountDataReady;
    }

    accessChecked()
    {
        if (!this.useAccounts())
        {
            return true;
        }

        return this.state.accessCheckResult !== null && this._lastRouteChecked === FlowRouter.current().path;
    }

    redirectExpected()
    {
        if (!this.useAccounts())
        {
            return false;
        }

        return this.state.accessCheckResult !== 200;
    }

    isReady()
    {
        return this.accountsReady() && this.accessChecked() && !this.redirectExpected();
    }

    renderExtras()
    {
        return null;
    }

    render() {
        const PageController = this.props.main;
        const rProps = this.getRouteProps();

        // if we use accounts and we are waiting for user data from the database,
        // we render as null to avoid unnecessary code to run
        if (!this.userDataReady())
        {
            return null;
        }

        let Layout = this.constructor.getDefaultApplicationLayoutController();
        if ('layout' in rProps)
        {
            Layout = rProps.layout ? rProps.layout : 'div';
        }

        return (
            <div
                className="application"
                ref={(ref) => { this._appContainer = ref; }}
            >
                <Layout className="application__layout">
                    {
                        this.isReady()
                        &&
                        React.createElement(PageController, this.transformPageParameters({
                            route: rProps,
                        }))
                    }
                </Layout>
                {this.renderExtras()}
            </div>
        );
    }
}
