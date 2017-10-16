import React from 'react';
import Header from '../../../ui/component/header/index.jsx';
import LoadOverlay from '../../../ui/component/general/etc/global-overlay/index.jsx';
import LoadIndicator from '../../../ui/component/general/etc/global-load-progress/index.jsx';
import Util from '../../util.js';
import BaseComponent from '../component/component.jsx';
// import PreRender from '../../../lib/prerender.js';
import {DocHead} from 'meteor/kadira:dochead';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {createRouter} from 'meteor/cultofcoders:meteor-react-routing';
import {createContainer} from 'meteor/react-meteor-data';

export default class Application extends BaseComponent
{
    static _router = null;
    static _instance = null;
    static _routerController = null;

    static _userDataReady = null;

    /**
     * Application initialization entry point
     */
    static init()
    {
        if (this.useAccounts())
        {
            // create reactive container to track the moment when we got authorized
            this._routerController = createContainer((props) => {
                return {
                    // user: Meteor.subscribe('self') && Meteor.user(),
                    waitUserData: Meteor.loggingIn(),
                    ...props,
                };
            }, this);
        }
        else
        {
            // if we dont use accounts, make it simplier
            this._routerController = this;
        }

        this.registerRoutes();
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
                params: {},
            },
            404: {
                path: '/404',
                controller: this.get404PageController(),
                params: {},
            },
            401: {
                path: '/401',
                controller: this.get401PageController(),
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

    static getRouter()
    {
        if (this._router === null)
        {
            // creating new router over the container created over the application
            this._router = createRouter(this._routerController);
        }

        return this._router;
    }

    static addRoute(path, controller = null, params = {})
    {
        if (controller)
        {
            this.getRouter()(path, controller, params);
        }
        else
        {
            FlowRouter.route(path, params);
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

    static get401PageController()
    {
        throw new Error('Not implemented: static get401PageController()');
    }

    static getLoginPageController()
    {
        throw new Error('Not implemented: static getLoginPageController()');
    }

    static attachUserAccountRoutes(routes)
    {
        routes['login'] = {
            path: '/login',
            controller: this.getLoginPageController(),
            params: {
                layout: null,
            },
        };
        routes['logout'] = {
            path: '/logout',
            params: {
                action: () => {
                    Meteor.logout(() => {
                        FlowRouter.go('/login');
                    });
                },
            },
        };
    }

    static registerRoutes()
    {
        FlowRouter.notFound = {
            action: function() {
                FlowRouter.go('/404');
            }
        };

        Object.values(this.getRouteMap()).forEach((route) => {
            this.addRoute(route.path, route.controller, route.params || {});
        });
    }

    /**
     * @deprecated
     * @returns {*}
     */
    static getInstance()
    {
        if(this._instance)
        {
            return this._instance;
        }

        // return mock
        return {
            wait: function(){},
        };
    }

    /**
     * Inform the application that we are waiting for some promise
     * @param p
     * @returns {*}
     */
    static wait(p)
    {
        return this.getInstance().wait(p);
    }

    _appContainer = null;

    constructor(props)
    {
        super(props);
        this.state = {
            loaded: false
        };

        this._overlay = null;
        this._map = null;
        this._indicator = null;
        this._imageView = null;

        this.setPageTitle();
        this.setDescription();
        this.setKeywords();
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
    }

    componentDidMount()
    {
        // this.fire('wait-all');

        /**
         * Have to use native JS to avoid problems with FlowRouter when clicking on href-s.
         * We use capturing to prevent being affected with cancelBubble.
         */
        if (this._appContainer && _.isArrayNotEmpty(this.getGlobalSelectorMap()))
        {
            this.onGlobalClick = this.onGlobalClick.bind(this);
            this._appContainer.addEventListener('click', this.onGlobalClick, true);
        }

        if (this.useAccounts() && this.props.waitUserData)
        {
            // wait for user data to be loaded, reactively
            this.wait(new Promise((resolve) => {
                this._userDataReady = resolve;
            }));
        }

        // console.dir(this.props.waitUserData);
        this.restrictAccess(this.props);
    }

    componentWillReceiveProps(props)
    {
        if (this.useAccounts() && !this.props.waitUserData && _.isFunction(this._userDataReady))
        {
            // tell that user data was loaded
            this._userDataReady();
        }

        // console.dir(props.waitUserData);
        this.restrictAccess(props);
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

    extendState(extra)
    {
        if(_.isObject(extra))
        {
            Object.assign(this.state, extra);
        }
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

    makeTitle(title = '')
    {
        if (_.isStringNotEmpty(title)) {
            return title.replace(/#DASH#/g, '–');
        }

        return '';
    }

    setTitle(title = '')
    {
        this.fire('set-title', title);
        this.setPageTitle(title);
    }

    setPageTitle(title)
    {
        let titlePostfix = this.getMainTitle();
        title = this.makeTitle(title);
        if (title.length > 0)
        {
            title = `${title} – ${titlePostfix}`
        }
        DocHead.setTitle(title);
    }

    // todo: move to the page logic
    setDescription(text = '')
    {
        DocHead.addMeta({
            name: "description",
            content: _.isStringNotEmpty(text) ? text : this.getMainTitle(),
        });
    }

    // todo: move to the page logic
    setKeywords(keywords = [])
    {
        let kw = [];
        if (_.isArrayNotEmpty(keywords))
        {
            kw = keywords;
        }

        DocHead.addMeta({
            name: "keywords",
            content: kw.join(', '),
        });
    }

    getMainTitle()
    {
        return 'Project name';
    }

    transformPageParameters(params)
    {
        return params;
    }

    useAccounts()
    {
        return this.constructor.useAccounts();
    }

    restrictAccess(props)
    {
        if (this.useAccounts())
        {
            // do some access checking...
        }
        // FlowRouter.go('/401');
        // if (roles) {
        //     if (isLoggingIn) {
        //         return <Loading />;
        //     }
        //
        //     if (user) {
        //         let isAuthorized;
        //         if (_.contains(roles, 'USER')) {
        //             isAuthorized = true;
        //         } else {
        //             isAuthorized = Roles.userIsInRole(user._id, roles) || Roles.userIsInRole(user._id, 'SUPER_ADMIN');
        //         }
        //
        //         if (!isAuthorized) {
        //             return <NotAuthorized />;
        //         }
        //     } else {
        //         return <NotAuthorized />;
        //     }
        // }
    }

    renderExtras()
    {
        return null;
    }

    render()
    {
        const {main, routeProps} = this.props;
        
        return (
            <div
                className="layout"
                ref={(ref) => { this._appContainer = ref; }}
            >
                {React.createElement(main, this.transformPageParameters({
                    route: routeProps,
                }))}
                {this.renderExtras()}
            </div>
        );
    }
}
