import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';

import schema from './schema/login.schema.js';
import {FlowRouter} from 'meteor/kadira:flow-router';
import AutoForm from 'uniforms-unstyled/AutoForm';

import './style.less';

export default class LoginPage extends BasePage {
    constructor() {
        super();
        this.state = {
            // error: false,
            // errorMessage: null
        };
    }

    onSubmitForm(data) {
        return new Promise((resolve, reject) => {
            this.data = data;
            const email = this.data.email;
            const password = this.data.password;
            // const hashedPassword = Utils.SHA256(password);

            Meteor.loginWithPassword(email, password, (error) => {
                if (!error) {
                    FlowRouter.go('/');
                    resolve();
                } else {
                    reject('');
                }
            });
        });
    }

    onSubmitFailure() {
        this.setState({
            // error: true,
            // errorMessage: ''
        });
    }

    clearServerError() {
        this.setState({
            // errorMessage: null
        });
    }

    render() {
        return (
            <div className="layout content_v_center_h_center h_100p">
                <div className="layout__inner_centered">
                    LOGIN
                    <AutoForm
                        schema={schema}
                        onSubmit={this.onSubmitForm.bind(this)}
                        onSubmitFailure={this.onSubmitFailure.bind(this)}
                        // showInlineError
                    >
                    </AutoForm>
                </div>
            </div>
        );
    }
}
