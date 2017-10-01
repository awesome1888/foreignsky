import React from 'react';

import './style.less';
// import PropTypes from 'prop-types';

import PopupPane from '../popup-pane/index.jsx';

export default class Balloon extends PopupPane
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
        return `balloon balloon_${this.props.position}`;
    }

    renderChildren()
    {
        return (
            <div className="balloon__inner">
                <div className="balloon__content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
