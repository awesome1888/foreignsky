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
        });

        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal()
    {
        this.setState({
            modalOpened: !this.state.modalOpened,
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
                            <div>Hey man, whats up! I am the modal one!</div>
                        </Modal>
                    </div>
                }
            />
        );
    }
}
