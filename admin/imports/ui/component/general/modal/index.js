import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import BaseComponent from '../../../../lib/base/component/component.jsx';

import './style.less';

export default class Modal extends BaseComponent
{
    _overlay = null;

    constructor(props)
    {
        super(props);
        this.onClickOverlay = this.onClickOverlay.bind(this);
    }

    static propTypes = {
        opened: PropTypes.bool,
        onClose: PropTypes.oneOfType(PropTypes.func, PropTypes.bool),
        showCloseButtin: PropTypes.bool,
    };

    static defaultProps = {
        opened: false,
        onClose: null,
        showCloseButtin: true,
    };

    isCloseButtonDisplayable()
    {
        return this.isCloseable() && this.props.showCloseButtin;
    }

    isCloseable()
    {
        return _.isFunction(this.props.onClose);
    }

    onClickOverlay(e)
    {
        if (this.isCloseable() && _.isObject(e))
        {
            if (e.target === this._overlay)
            {
                this.props.onClose();
            }
        }
    }

    render() {
        return (
            <div
                className={classnames({
                    'mmodal': true,
                    'no-display': !this.props.opened,
                })}
            >
                <div
                    className="mmodal__overlay"
                    onClick={this.onClickOverlay}
                    ref={reference => this._overlay = reference}
                >
                    <div className="mmodal__container">
                        <div
                            className="mmodal__container"
                        >
                            {this.props.children}
                        </div>
                        {
                            this.isCloseButtonDisplayable()
                            &&
                            <div
                                className="mmodal__close"
                                onClick={this.props.onClose}
                                title="Close"
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
}
