import React from 'react';
import BaseComponent from '../../../../../lib/base/component/component.jsx';
import PageScroll from '../../../../../lib/util/page-scroll.js';

import PropTypes from 'prop-types';

import './style.less';

export default class GoUp extends BaseComponent
{
    static propTypes = {
        hAlignRelativeTo: PropTypes.string,
        scrollTopThreshold: PropTypes.number,
    };

    static defaultProps = {
        hAlignRelativeTo: '',
        scrollTopThreshold: 100,
    };

    constructor(props)
    {
        super(props);

        this.extendState({
            shown: false,
        });
    }

    componentDidMount()
    {
        this.solvePosition();
        this.onApplication('window-metrics', this.onWindowMetricChange.bind(this));
    }

    onWindowMetricChange(data)
    {
        this.solvePosition(data);
    }

    onScrollTopClick()
    {
        PageScroll.scrollTo(0, 300);
    }

    solvePosition(data)
    {
        const to = this.getRelativeTo();
        if (to)
        {
            const root = $(this.getRootNode());

            const offset = to.offset();
            const w = to.outerWidth(false);
            const buttonW = root.outerWidth(false);

            const left = `${(offset.left + Math.round(w / 2) - Math.round(buttonW / 2))}px`;

            root.css('left', left);
        }

        if (_.isObjectNotEmpty(data))
        {
            this.setState({
                shown: data.scrollTop > this.props.scrollTopThreshold,
            });
        }
    }

    getRelativeTo() {
        if (!this._relativeTo)
        {
            const css = this.props.hAlignRelativeTo;
            if (_.isStringNotEmpty(css))
            {
                this._relativeTo = $(css);
            }
            else
            {
                this._relativeTo = null;
            }
        }

        return this._relativeTo;
    }

    isShown()
    {
        return this.state.shown;
    }

    render()
    {
        return (
            <div
                className={`go-up ${this.isShown() ? 'go-up_shown' : ''} ${this.props.className || ''}`}
                ref={ ref => {this._scope = ref; }}
                onClick={this.onScrollTopClick.bind(this)}
            >
                <div className="go-up__icon" />
                <div className="go-up__label">

                </div>
                Go UP!
            </div>
        );
    }
}
