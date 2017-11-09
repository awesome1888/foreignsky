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
            window.__emitter = this._instance;
        }

        return this._instance;
    }

    _events = [];
    _windowMetricsEvents = [];
    _windowMetricsBound = false;

    constructor()
    {
        this.onWindowMetricChange = _.throttle(this.onWindowMetricChange.bind(this), 300);
    }

    /**
     * Hangs on the specified custom event
     * todo: probably use event emitter here
     * @param event
     * @param cb
     */
    on(event, cb, owner = nll)
    {
        // todo: also could be 'document-keydown', 'document-click' etc...
        if (event === 'window-metrics')
        {
            this._windowMetricsEvents.push({
                cb,
                owner,
            });

            this.maybeBindMetricEvent();
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
        if (event === 'window-metrics')
        {
            if (clean)
            {
                this._windowMetricsEvents = this._windowMetricsEvents.filter((item) => {
                    return item.cb !== cb;
                });

                this.maybeUnbindMetricEvent();
            }
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

    getWindowJQ()
    {
        if (!this._window)
        {
            this._window = $(window);
        }

        return this._window;
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

    maybeUnbindMetricEvent()
    {
        if (!(this._windowMetricsEvents.length) && this._windowMetricsBound)
        {
            $(window).off('scroll', this.onWindowMetricChange);
            $(window).off('resize', this.onWindowMetricChange);
            this._windowMetricsBound = false;
        }
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
}
