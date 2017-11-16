import React from 'react';
import {Component} from 'react';
import {Meteor} from 'meteor/meteor';

import Application from '../../../ui/application.jsx';
import Util from '../../../lib/util.js';

import EventEmitter from '../../util/event-emitter/index.js';

export default class BaseComponent extends Component
{
    _scope = null;
    _cache = null; // this is used to store temporal cached data, to boost operations
    _id = null;

    constructor(props)
    {
        super(props);
        this.state = {};
        this.clearCache();
    }

    componentWillMount()
    {
    }

    componentWillUnmount()
    {
        EventEmitter.getInstance().offByOwner(this);
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
        return Application.getInstance();
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
        this.fire('set-title', [title]);
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

    on(event, cb)
    {
        EventEmitter.getInstance().on(event, cb, this);
    }

    off(event, cb)
    {
        EventEmitter.getInstance().off(event, cb);
    }

    fire(event, args = [])
    {
        EventEmitter.getInstance().fire(event, args);
    }

    onDocumentClick(selector, callback)
    {
        if (_.isStringNotEmpty(selector) && _.isFunction(callback))
        {
            this.on('document-click', (e) => {
                const node = Util.findClosestParent(e.target, selector);
                if (node)
                {
                    callback(e, node);
                }
            });
        }
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
        EventEmitter.getInstance().fire(event, args);
    }
}
