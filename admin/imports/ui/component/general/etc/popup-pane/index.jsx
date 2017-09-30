import React from 'react';

import BaseComponent from '../../../../../lib/base/component/component.jsx';

import PropTypes from 'prop-types';

export default class PopupPane extends BaseComponent
{
    static propTypes = {
        // the opened\closed state is controlled outside, through properties
        opened: PropTypes.bool,
        onClose: PropTypes.func,

        className: PropTypes.bool,
    };

    static defaultProps = {
        opened: false,
        onClose: null,
        className: '',
    };

    constructor(props)
    {
        super(props);
        // this.extendState({
        // });

        this.onDocumentClick = this.onDocumentClick.bind(this);
    }

    componentDidMount()
    {
        $(window.document).on('click', this.onDocumentClick);
    }

    componentWillUnmount()
    {
        $(window.document).off('click', this.onDocumentClick);
    }

    onClose()
    {
        if (_.isFunction(this.props.onClose))
        {
            this.props.onClose();
        }
    }

    onDocumentClick(e)
    {
        if (!this.props.opened)
        {
            console.dir('skip!');
            return;
        }

        let node = e.target;
        while(node)
        {
            if (node === this._scope)
            {
                return;
            }

            node = node.parentElement;
        }

        console.dir('fire close!');
        this.onClose();
    }

    renderChildren()
    {
        return this.props.children;
    }

    getClassName()
    {
        return this.props.className;
    }

    render()
    {
        return (
            <div
                className={`popup-pane ${this.getClassName()} ${this.props.opened ? '' : 'no-display'}`}
                ref={ ref => {this._scope = ref; }}
            >
                {this.renderChildren()}
            </div>
        );
    }
}
