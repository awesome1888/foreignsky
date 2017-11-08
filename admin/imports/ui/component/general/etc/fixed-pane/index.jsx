import React from 'react';
import BaseComponent from '../../../../../lib/base/component/component.jsx';

import PropTypes from 'prop-types';

// import './style.less';

export default class FixedPane extends BaseComponent
{
    static propTypes = {
    };

    static defaultProps = {
    };

    constructor(props)
    {
        super(props);
        this.extendState({
        });

        this.onApplication('window-metrics', this.onWindowMetricChange.bind(this));
    }

    onWindowMetricChange() {
        console.dir('window changed!');
    }



    render()
    {
        return (
            <div
                className={`fixed-pane ${this.props.className}`}
                ref={ ref => {this._scope = ref; }}
            >
                <div className={`fixed-pane__bar ${this.props.paneClassName}`}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
