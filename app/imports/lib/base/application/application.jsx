import React from 'react';
import Header from '../../../ui/component/header/index.jsx';
import LoadOverlay from '../../../ui/component/load-overlay/index.jsx';
import LoadIndicator from '../../../ui/component/load-indicator/index.jsx';
import Util from '../../util.js';
import BaseComponent from '../component/component.jsx';
import {DocHead} from 'meteor/kadira:dochead';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {createRouter} from 'meteor/cultofcoders:meteor-react-routing';

export default class Application extends BaseComponent
{
    static _router = null;
    static _instance = null;

    static init()
    {
        this.registerRoutes();
        // do whatever else needed
    }

    static getRouter()
    {
        if (this._router === null)
        {
            this._router = createRouter(this);
        }

        return this._router;
    }

    static addRoute(path, controller, params = {})
    {
        this.getRouter()(path, controller, params);
    }

    static getRouteMap()
    {
        return {
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
        };
    }

    static getHomePageController()
    {
        throw new Error('Not implemented: static getHomePageController()');
    }

    static get404PageController()
    {
        throw new Error('Not implemented: static get404PageController()');
    }

    static attachUserAccountRoutes(routes)
    {
        routes['login'] = {
            path: '/login',
            controller: null,
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

        this.onGlobalClick = this.onGlobalClick.bind(this);
    }

    getGlobalSelectorMap()
    {
        return [];
    }

    componentWillMount()
    {
        this.constructor._instance = this;
    }

    componentDidMount()
    {
        if(this.getOverlay())
        {
            this.getOverlay().waitAll();
        }

        // shit-fix
        if (this.getIndicator())
        {
            const p = new Promise((resolve) => {resolve()});
            this.getIndicator().waitOne(p);
        }

        /**
         * Have to use native JS to avoid problems with FlowRouter when clicking on href-s.
         * We use capturing to prevent being affected with cancelBubble.
         */
        if (this._appContainer && _.isArrayNotEmpty(this.getGlobalSelectorMap())) {
            this._appContainer.addEventListener('click', this.onGlobalClick, true);
        }
    }

    /**
     * That will never happen, but anyway :)
     */
    componentWillUnMount() {
        if (this._appContainer) {
            this._appContainer.removeEventListener('click', this.onGlobalClick, true);
        }
    }

    onGlobalClick(e) {
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

    getOverlay()
    {
        return this._overlay;
    }

    setOverlay(ref)
    {
        if(!this._overlay)
        {
            this._overlay = ref;
        }
    }

    getIndicator()
    {
        return this._indicator;
    }

    setIndicator(ref)
    {
        if(!this._indicator)
        {
            this._indicator = ref;
        }
    }

    getQuery() {
        return FlowRouter.current().queryParams;
    }

    wait(p)
    {
        if(this.getOverlay())
        {
            this.getOverlay().waitOne(p);
        }
        if(this.getIndicator())
        {
            this.getIndicator().waitOne(p);
        }

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

    setDescription(text = '')
    {
        DocHead.addMeta({
            name: "description",
            content: _.isStringNotEmpty(text) ? text : this.getMainTitle(),
        });
    }

    setKeywords(keywords = [])
    {
        let kw = [
            'берлин','блог','город','поездка','достопримечательности',
            'места','памятники','статьи','экскурсии','германия',
        ];
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

    showOverlay()
    {
        return true;
    }

    showIndicator()
    {
        return true;
    }

    transformPageParameters(params)
    {
        return params;
    }

    renderExtras()
    {
        return null;
    }

    render() {
        const {main, routeProps} = this.props;

        return (
            <div
                className="layout"
                ref={(ref) => { this._appContainer = ref; }}
            >
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
                {React.createElement(main, this.transformPageParameters({
                    route: routeProps,
                }))}
                {this.renderExtras()}
            </div>
        );
    }
}
