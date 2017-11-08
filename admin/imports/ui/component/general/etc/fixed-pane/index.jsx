import React from 'react';
import BaseComponent from '../../../../../lib/base/component/component.jsx';

import PropTypes from 'prop-types';

import './style.less';

export default class FixedPane extends BaseComponent
{
    static propTypes = {
        paneClassName: PropTypes.string,
    };

    static defaultProps = {
        paneClassName: '',
    };

    _pane = null;

    componentDidMount()
    {
        this.solvePosition();
        this.onApplication('window-metrics', this.onWindowMetricChange.bind(this));
    }

    onWindowMetricChange()
    {
        this.solvePosition();
    }

    getPane()
    {
        return this._pane;
    }

    solvePosition()
    {
        const root = $(this.getRootNode());
        const pane = $(this.getPane());

        // set pane width equal to its parent width
        pane.width(`${root.width()}px`);

        // set parent height equal to the pane height
        root.height(`${pane.height()}px`);

        // todo: 1) probably will need to adjust left fixed position also
        // todo: 2) will also need to switch off "fixed" position when fixed-pane is visible
        // todo: 3) when fixed-pane is hidden under the bottom edge of the screen, it should be attached
        // todo:    to the bottom edge. And the same is about the top edge of the screen.
    }

    render()
    {
        return (
            <div
                className={`fixed-pane ${this.props.className || ''}`}
                ref={ ref => {this._scope = ref; }}
            >
                <div
                    className={`fixed-pane__bar ${this.props.paneClassName}`}
                    ref={ ref => {this._pane = ref; }}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}
