import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import BaseComponent from '../../../../lib/base/component/component.jsx';

import './style.less';

export default class Modal extends BaseComponent
{
    static propTypes = {
        opened: PropTypes.bool,
        onClose: PropTypes.oneOfType(PropTypes.func, PropTypes.bool),
    };

    static defaultProps = {
        opened: false,
        onClose: null,
    };

    isCloseable()
    {
        return _.isFunction(this.props.onClose);
    }

    render() {
        return (
            <div
                className={classnames({
                    'mmodal': true,
                    'no-display': !this.props.opened,
                })}
            >
                <div className="mmodal__overlay">
                    <div className="mmodal__container">
                        <div
                            className="mmodal__container"
                        >
                            {this.props.children}
                        </div>
                        <div
                            className="mmodal__close"
                            onClick={this.props.onClose}
                            title="Close"
                        />
                    </div>
                </div>
            </div>
        );
    }
}
