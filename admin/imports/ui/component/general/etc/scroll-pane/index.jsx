import React from 'react';

import BaseComponent from '../../../../../lib/base/component/component.jsx';

import './style.less';
import PropTypes from 'prop-types';

export default class ScrollPane extends BaseComponent
{
    _bounds = null;

    static propTypes = {
        className: PropTypes.string,
        innerClassName: PropTypes.string,
    };

    static defaultProps = {
        className: '',
        innerClassName: '',
    };

    constructor(props)
    {
        super(props);

        this.onScroll = this.onScroll.bind(this);
    }

    onScroll(e)
    {
        const scope = this.getRootNode();
        const bounds = this.getBoundsNode();
        
        // blocking scroll up
        if (e.deltaY < 0 && scope.scrollTop <= 0)
        {
            e.preventDefault();
            return;
        }

        const bH = this.getHeight(bounds);
        if (bH === 0)
        {
            console.error('ScrollPane: bound node has zero height, this will not work out. Forgot to add ._clearfix() or smth?');
        }

        // blocking scroll down
        if(e.deltaY > 0)
        {
            if (scope.scrollTop + this.getHeight(scope) >= bH)
            {
                e.preventDefault();
            }
        }
    }

    getHeight(el)
    {
        return el.getBoundingClientRect().height;
    }

    getBoundsNode()
    {
        return this._bounds;
    }

    render()
    {
        return (
            <div
                className={`scroll-pane ${this.props.className}`}
                ref={ref => {this._scope = ref;}}
                onWheel={this.onScroll}
            >
                <div
                    className={`scroll-pane__inner ${this.props.innerClassName}`}
                    ref={ref => {this._bounds = ref;}}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}
