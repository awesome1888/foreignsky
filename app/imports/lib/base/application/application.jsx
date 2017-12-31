import React from 'react';
import BaseComponent from '../component/component.jsx';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {createRouter} from 'meteor/cultofcoders:meteor-react-routing';
import {createContainer} from 'meteor/react-meteor-data';
import Security from '../../util/security/security.client.js';
import SecurityProvider from '../../util/security/provider.js';
import ConsoleOutput from '../../util/console-output/index.js';
import Crawler from '../../crawler.js';

import Option from '../../../api/option/entity/entity.client.js';

import Accounts from './accounts/index.js';

export default class Application extends BaseComponent
{
    static _router = null;
    static _instance = null;
    static _routerController = null;
    static _subscriptions = null;

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

        this.prepareRouter();
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
            Tracker.autorun(() => {
                if (this.subscriptionsReady())
                {
                    if (!FlowRouter._initialized)
                    {
                        FlowRouter.initialize();
                    }
                }
            });
        }
    }

    static needPostponeRouterInit()
    {
        return this.getSubscriptions().length > 0;
    }

    static subscriptionsReady()
    {
        const subs = this.subscribe();
        let ready = true;
        subs.forEach((sub) => {
            if (!sub.ready())
            {
                ready = false;
            }
        });

        return ready;
    }

    static subscribe()
    {
        if (this._subscriptions === null)
        {
            this._subscriptions = this.getSubscriptions().map((sub) => {
                return Meteor.subscribe(sub.name, sub.cb || undefined);
            });
        }

        return this._subscriptions;
    }

    static getSubscriptions()
    {
        const subscriptions = [
            {name: 'option.main', cb: () => {
                // todo: extremely stupid spike, but I got no idea
                // todo: how to make this woodoo magic of DDP work outside
                // todo: of this callback. srsly
                Option.reloadPublished();
            }},
        ];
        if (this.useAccounts())
        {
            subscriptions.push(Accounts.getSubscription());
        }

        return subscriptions;
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
     * @param p
     * @returns {*}
     */
    static wait(p)
    {
        return this.getInstance().wait(p);
    }

    _appContainer = null;
    _lastRouteChecked = null;
    _waitPool = [];
    _waitLock = false;
    _firstLoad = true;

    constructor(props)
    {
        super(props);
        this.extendState(Object.assign({
        }, this.getAccountInitialState()));

        if (this.useAccounts())
        {
            this.on('router-go', this.onRouteChange.bind(this));
        }

        if (Meteor.isDevelopment)
        {
            window.__application = this;
        }

        this.startWait = _.debounce(this.startWait.bind(this), 100);
    }

    componentWillMount()
    {
        this.constructor._instance = this;

        if (this.useAccounts())
        {
            this.processSecurity();
        }
    }

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

    wait(p)
    {
        // check if we can accept new promises, or the process was already started
        if(!this._waitLock)
        {
            if (!this._waitPool.length)
            {
                // tell all components to start showing loader indicator, if any
                this.fire('load-start');
            }

            // save the next promise to the list of "to-wait"
            this._waitPool.push(p);

            // try to start the process (this function is de-bounced)
            this.startWait();
        }

        return p;
    }

    startWait()
    {
        this._waitLock = true;

        // wait for all promises, then set the percentage to 100
        Promise.all(this._waitPool).then(() => {
            this.endWait();
        }).catch(() => {
            this.endWait();
        });
    }

    endWait()
    {
        this.fire('load-end');
        if (this._firstLoad)
        {
            Crawler.setReady();
        }

        this._waitPool = [];
        this._waitLock = false;
        this._firstLoad = false;
    }

    onRouteChange()
    {
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
        }).catch(() => {
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

    getQuery()
    {
        return FlowRouter.current().queryParams;
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
        const rProps = this.getRouteProps();

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
                <Layout
                    className="application__layout"
                    ready={this.isReady()}
                >
                    {
                        this.isReady()
                        &&
                        React.createElement(this.props.main, this.transformPageParameters({
                            route: rProps,
                        }))
                    }
                </Layout>
                {this.renderExtras()}
            </div>
        );
    }
}
