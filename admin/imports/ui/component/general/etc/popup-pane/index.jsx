import React from 'react';

import BaseComponent from '../../../../../lib/base/component/component.jsx';

import PropTypes from 'prop-types';

// todo: implement show up/down, close by escape
export default class PopupPane extends BaseComponent
{
    static propTypes = {
        // the opened\closed state is controlled outside, through properties
        opened: PropTypes.bool,
        onClose: PropTypes.func,
        globalClickClose: PropTypes.bool,
        closeByEsc: PropTypes.bool,
        closeStopSelector: PropTypes.string, // if you are unable to stop the click event propagation, this will help

        className: PropTypes.string,
    };

    static defaultProps = {
        opened: false,
        globalClickClose: true,
        closeByEsc: false,
        closeStopSelector: '',
        onClose: null,
        className: '',
    };

    constructor(props)
    {
        super(props);
        // this.extendState({
        // });

        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    }

    componentDidMount()
    {
        if (this.props.globalClickClose)
        {
            // dirty hack, to prevent popup from opening and immediately closing :(
            Meteor.setTimeout(() => {
                $(window.document).on('click', this.onDocumentClick);
            }, 1);
        }

        if (this.props.closeByEsc)
        {
            $(window.document).on('keydown', this.onDocumentKeyDown);
        }
    }

    componentWillUnmount()
    {
        $(window.document).off('click', this.onDocumentClick);
        $(window.document).off('keydown', this.onDocumentKeyDown);
    }

    onDocumentKeyDown(e) {
        if (e.key === 'Escape') {
            this.onClose();
        }
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
            return;
        }

        let node = e.target;
        while(node)
        {
            if (node === this._scope)
            {
                return;
            }
            if (this.props.closeStopSelector && $(node).is(this.props.closeStopSelector))
            {
                return;
            }

            node = node.parentElement;
        }

        this.onClose();
    }

    renderChildren()
    {
        return this.props.children;
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
