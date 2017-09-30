import React from 'react';

import BaseComponent from '../../../../../lib/base/component/component.jsx';

import './style.less';
import PropTypes from 'prop-types';

export default class Popup extends BaseComponent
{
    static propTypes = {
        position: PropTypes.oneOf(['top', 'bottom']),
        opened: PropTypes.bool,
        showCloseButton: PropTypes.bool,
    };

    static defaultProps = {
        position: 'bottom',
        opened: false,
        showCloseButton: false,
    };

    constructor(props)
    {
        super(props);
        this.extendState({
        });
    }

    render()
    {
        return (
            <div
                className={`popup popup_${this.props.position} ${this.props.opened ? '' : 'no-display'}`}
                ref={ ref => {this._scope = ref; }}
            >
                <div className="popup__inner">
                    <div className="popup__content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
