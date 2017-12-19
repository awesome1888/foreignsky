/**
 * Custom global event emitter
 *
 * todo: also, there could be onMouseMove, onMouseWheel, onDocumentClick, onDocumentKeyDown and so on...
 */
export default class EventEmitter
{
    static _instance = null;

    static getInstance()
    {
        if (!this._instance)
        {
            this._instance = new this();
            if (Meteor.isDevelopment)
            {
                window.__emitter = this._instance;
            }
        }

        return this._instance;
    }

    _events = [];
    _windowMetricsEvents = [];
    _windowMetricsBound = false;
    _documentClickEvents = [];
    _documentClickBound = false;
    _documentKeyDownEvents = [];
    _documentKeyDownBound = false;

    constructor()
    {
        this.onWindowMetricChange = _.throttle(this.onWindowMetricChange.bind(this), 300);
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    }

    /**
     * Hangs on the specified custom event
     * todo: probably use event emitter here
     * @param event
     * @param cb
     * @param owner
     */
    on(event, cb, owner = nll)
    {
        if (event === 'window-metric-change')
        {
            this._windowMetricsEvents.push({
                cb,
                owner,
            });

            this.maybeBindMetricEvent();
        }
        else if (event === 'document-click')
        {
            this._documentClickEvents.push({
                cb,
                owner,
            });

            this.maybeBindDocumentClick();
        }
        else if (event === 'document-keydown')
        {
            this._documentKeyDownEvents.push({
                cb,
                owner,
            });

            this.maybeBindDocumentKeyDown();
        }
        else
        {
            $(document).on(event, cb);
            this._events.push({
                event,
                cb,
                owner,
            });
        }
    }

    off(event, cb, clean = true)
    {
        // todo: also could be 'document-keydown', 'document-click' etc...
        if (event === 'window-metric-change')
        {
            if (clean)
            {
                this._windowMetricsEvents = this._windowMetricsEvents.filter((item) => {
                    return item.cb !== cb;
                });

                this.maybeUnbindMetricEvent();
            }
        }
        else if (event === 'document-click')
        {
            this._documentClickEvents = this._documentClickEvents.filter((item) => {
                return item.cb !== cb;
            });

            this.maybeUnbindDocumentClick();
        }
        else if (event === 'document-keydown')
        {
            this._documentKeyDownEvents = this._documentKeyDownEvents.filter((item) => {
                return item.cb !== cb;
            });

            this.maybeUnbindDocumentKeyDown();
        }
        else
        {
            $(document).unbind(event, cb);
            if (clean)
            {
                this._events = this._events.filter((item) => {
                    return item.cb !== cb || item.event !== event;
                });
            }
        }
    }

    offByOwner(owner)
    {
        if(_.isArrayNotEmpty(this._events))
        {
            this._events.forEach((item) => {
                if (item.owner === owner)
                {
                    this.off(item.event, item.cb, false);
                }
            });

            this._events = this._events.filter((item) => {
                return item.owner !== owner;
            });
        }

        if (_.isArrayNotEmpty(this._windowMetricsEvents))
        {
            this._windowMetricsEvents = this._windowMetricsEvents.filter((item) => {
                return item.owner !== owner;
            });

            this.maybeUnbindMetricEvent();
        }

        if (_.isArrayNotEmpty(this._documentClickEvents))
        {
            this._documentClickEvents = this._documentClickEvents.filter((item) => {
                return item.owner !== owner;
            });

            this.maybeUnbindDocumentClick();
        }

        if (_.isArrayNotEmpty(this._documentKeyDownEvents))
        {
            this._documentKeyDownEvents = this._documentKeyDownEvents.filter((item) => {
                return item.owner !== owner;
            });

            this.maybeUnbindDocumentKeyDown();
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

    onWindowMetricChange()
    {
        const data = {};
        const w = this.getWindowJQ();

        data.scrollTop = w.scrollTop();

        this._windowMetricsEvents.forEach((item) => {
            item.cb(data);
        });
    }

    getWindowJQ()
    {
        if (!this._window)
        {
            this._window = $(window);
        }

        return this._window;
    }

    maybeBindMetricEvent()
    {
        if (!this._windowMetricsBound)
        {
            $(window).on('scroll', this.onWindowMetricChange);
            $(window).on('resize', this.onWindowMetricChange);
            this._windowMetricsBound = true;
        }
    }

    maybeUnbindMetricEvent()
    {
        if (!(this._windowMetricsEvents.length) && this._windowMetricsBound)
        {
            $(window).off('scroll', this.onWindowMetricChange);
            $(window).off('resize', this.onWindowMetricChange);
            this._windowMetricsBound = false;
        }
    }

    onDocumentClick(e)
    {
        this._documentClickEvents.forEach((item) => {
            item.cb(e);
        });
    }

    maybeBindDocumentClick()
    {
        if (!this._documentClickBound)
        {
            $(window.document).on('click', this.onDocumentClick);
            this._documentClickBound = true;
        }
    }

    maybeUnbindDocumentClick()
    {
        if (!(this._documentClickEvents.length) && this._documentClickBound)
        {
            $(window.document).off('click', this.onDocumentClick);
            this._documentClickBound = false;
        }
    }

    onDocumentKeyDown(e)
    {
        this._documentKeyDownEvents.forEach((item) => {
            item.cb(e);
        });
    }

    maybeBindDocumentKeyDown()
    {
        if (!this._documentKeyDownBound)
        {
            $(window.document).on('keydown', this.onDocumentKeyDown);
            this._documentKeyDownBound = true;
        }
    }

    maybeUnbindDocumentKeyDown()
    {
        if (!(this._documentKeyDownEvents.length) && this._documentKeyDownBound)
        {
            $(window.document).off('keydown', this.onDocumentKeyDown);
            this._documentKeyDownBound = false;
        }
    }
}
