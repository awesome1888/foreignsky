/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';
import List from './component/list/list.jsx';

import Modal from '../../component/general/modal/index.js';

export default class TestEntityListPage extends BasePage
{
    constructor(props)
    {
        super(props);
        this.extendState({
            modalOpened: false,
            modal2Opened: false,
            modal3Opened: false,
            modal31Opened: false,
        });

        this.toggleModal = this.toggleModal.bind(this);
        this.toggleModal2 = this.toggleModal2.bind(this);
        this.toggleModal3 = this.toggleModal3.bind(this);
        this.toggleModal31 = this.toggleModal31.bind(this);
    }

    toggleModal()
    {
        this.setState({
            modalOpened: !this.state.modalOpened,
        });
    }

    toggleModal2()
    {
        this.setState({
            modal2Opened: !this.state.modal2Opened,
        });
    }

    toggleModal3()
    {
        this.setState({
            modal3Opened: !this.state.modal3Opened,
        });
    }

    toggleModal31()
    {
        this.setState({
            modal31Opened: !this.state.modal31Opened,
        });
    }

	render()
    {
        return (
            <Layout
                title={this.props.title}
                motd={this.props.motd}
                central={
                    <div className="">
                        <List
                            detailPageUrl={this.props.route.detailPath || ''}
                        />
                        <button onClick={this.toggleModal}>Open modal</button>
                        <Modal
                            onClose={this.toggleModal}
                            opened={this.state.modalOpened}
                        >
                            <div>
                                Hey man, whats up! I am the modal one!<br />
                                <button
                                    onClick={this.toggleModal2}
                                >
                                    Show inner modal 2
                                </button>
                                <button
                                    onClick={this.toggleModal3}
                                >
                                    Show inner modal 3
                                </button>
                                <Modal
                                    onClose={this.toggleModal2}
                                    opened={this.state.modal2Opened}
                                >
                                    <div>
                                        Inner modal 2 here!
                                    </div>
                                </Modal>

                                <Modal
                                    onClose={this.toggleModal3}
                                    opened={this.state.modal3Opened}
                                >
                                    <div>
                                        Inner modal 3 here!
                                        <button
                                            onClick={this.toggleModal31}
                                        >
                                            Show inner modal 3.1
                                        </button>

                                        <Modal
                                            onClose={this.toggleModal31}
                                            opened={this.state.modal31Opened}
                                        >
                                            <div>
                                                Inner modal 3.1 here!
                                            </div>
                                        </Modal>

                                    </div>
                                </Modal>
                            </div>
                        </Modal>
                    </div>
                }
            />
        );
    }
}
