import React from 'react';
// import PropTypes from 'prop-types';

import BaseComponent from '../../../../lib/base/component/component.jsx';

import { Button, Header, Modal } from 'semantic-ui-react';

/**
 * The basic component for making forms: schema renderer
 * @abstract
 */
export default class ModalConfirm extends BaseComponent
{
    static propTypes = {
        // opened: PropTypes.bool,
        // text: PropTypes.string,
        // onFulfill: PropTypes.func,
        // onReject: PropTypes.func,
    };

    static defaultProps = {
        // opened: null,
        // onFulfill: x => x,
        // onReject: x => x,
        // text: 'Do you want something?',
    };

    constructor(props)
    {
        super(props);
        this.extendState({
            opened: false,
            resolve: null,
            text: '',
            headerText: '',
        });
    }

    async ask(text, headerText = '') {
        return new Promise((resolve) => {
            this.setState({
                opened: true,
                text,
                headerText,
                resolve,
            });
        });
    }

    onResolve(anwser) {
        if (_.isFunction(this.state.resolve))
        {
            this.state.resolve(anwser);
            this.reset();
        }
    }

    reset() {
        this.setState({
            opened: false,
            resolve: null,
            text: '',
        });
    }

    render()
    {
        return (
            <Modal open={this.state.opened} basic size='small'>
                <Header icon='question' content={this.state.headerText} />
                <Modal.Content>
                    <p>{this.state.text}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        basic
                        color='red'
                        inverted
                        onClick={this.onResolve.bind(this, false)}
                    >
                        No
                    </Button>
                    <Button
                        color='green'
                        inverted
                        onClick={this.onResolve.bind(this, true)}
                    >
                        Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
