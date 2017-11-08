import React from 'react';
import {Component} from 'react';
import {Meteor} from 'meteor/meteor';

import App from '../../../ui/application.jsx';
import Util from '../../../lib/util.js';

export default class BaseComponent extends Component
{
    _scope = null;
    _cache = null; // this is used to store temporal cached data, to boost operations
    _events = [];
    _appEvents = [];
    _id = null;

    constructor(props)
    {
        super(props);
        this.state = {};
        this.clearCache();
    }

    componentWillUnmount()
    {
        if(this._titleUpdated)
        {
            this.getApplication().setTitle();
            this._titleUpdated = false;
        }

        // un-bind custom events
        if(_.isArrayNotEmpty(this._events))
        {
            this._events.forEach((pair) => {
                this.off(pair.event, pair.cb, false);
            });
            this._events = null;
        }

        // un-bind application custom events
        if (_.isArrayNotEmpty(this._appEvents))
        {
            this._appEvents.forEach((pair) => {
                this.offApplication(pair.event, pair.cb, false);
            });
            this._appEvents = null;
        }
    }

    /**
     * Drops the cache of temporal data
     */
    clearCache()
    {
        this._cache = {};
    }

    /**
     * Adds new keys to the state, no reactivity, use it only in constructor
     * @param extra
     */
    extendState(extra)
    {
        if(_.isObject(extra))
        {
            Object.assign(this.state, extra);
        }
    }

    /**
     * Just a shortcut to the app instance
     * @returns {{wait}|*}
     */
    getApplication()
    {
        return App.getInstance();
    }

    /**
     * Returns the root node of the component, if any
     *
     * Dont forget to add
     * ref={ref => {this._scope = ref;}}
     * inside render() function to make this work.
     * @returns {*}
     */
    getRootNode()
    {
        return this._scope;
    }

    /**
     * Returns the className property, if any
     */
    getClassName()
    {
        return this.props.className || '';
    }

    setTitle(title = '')
    {
        this.getApplication().setTitle(title);
        this._titleUpdated = true;
    }

    /**
     * Executes a method, returns promise
     * @param name
     * @param args
     * @returns {Promise}
     */
    async execute(name, args)
    {
        return Util.execute(name, args).catch((error) => {
            this.showConsoleError(
                `Error invoking Method '${name}': `,
                err
            );
        });
    }

    showConsoleError(...args)
    {
        if (Meteor.isDevelopment)
        {
            // eslint-disable-next-line no-console
            console.error.apply(this, args);
        }

        // todo: show error notification
    }

    /**
     * Hangs on the specified custom event
     * todo: probably use event emitter here
     * @param event
     * @param cb
     */
    on(event, cb)
    {
        $(document).on(event, cb);
        this._events.push({
            event,
            cb,
        });
    }

    onApplication(event, cb) {
        this._appEvents.push({
            event,
            cb,
        });
        this.getApplication().on(event, cb);
    }

    off(event, cb, clean = true)
    {
        $(document).unbind(event, cb);
        if (clean)
        {
            this._events = this._events.filter((item) => {
                return item.cb !== cb || item.event !== event;
            });
        }
    }

    offApplication(event, cb, clean = true)
    {
        this.getApplication().off(event, cb);
        if (clean)
        {
            this._appEvents = this._appEvents.filter((item) => {
                return item.cb !== cb || item.event !== event;
            });
        }
    }

    /**
     * Fires the specified custom event
     * todo: probably use event emitter here
     * @param event
     * @param args
     */
    fire(event, args = [])
    {
        $(document).trigger(event, args);
    }

    getId()
    {
        if (this._id === null)
        {
            this._id = _.random(100000, 999999);
        }

        return this._id;
    }

    static fire(event, args = [])
    {
        $(document).trigger(event, args);
    }
}
