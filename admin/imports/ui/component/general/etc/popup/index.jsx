import React from 'react';

import './style.less';
// import PropTypes from 'prop-types';

import PopupPane from '../popup-pane/index.jsx';

export default class Popup extends PopupPane
{
    // static propTypes = {
    //     position: PropTypes.oneOf(['top', 'bottom']),
    // };
    //
    // static defaultProps = {
    //     position: 'bottom',
    // };

    getClassName()
    {
        return `popup popup_${this.props.position}`;
    }

    renderChildren()
    {
        return (
            <div className="popup__inner">
                <div className="popup__content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
