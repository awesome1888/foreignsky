import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Form from '../../component/general/form/form.jsx';

import {FlowRouter} from 'meteor/kadira:flow-router';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

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
                    <div className="margin-b_x padding-b_x f-size_x2p25">
                        Welcome back, commander!
                    </div>
                    <Form
                        map={[
                            {
                                code: 'login',
                                type: String,
                                label: 'E-mail',
                                regEx: SimpleSchema.RegEx.Email,
                            },
                            {
                                code: 'password',
                                type: String,
                                label: 'Password',
                                optional: true,
                                parameter: {
                                    secure: true,
                                },
                            },
                        ]}
                        submitButtonLabel="Login"
                        onSubmit={this.onSubmitForm.bind(this)}
                        // onSubmitFailure={this.onSubmitFailure.bind(this)}
                        // // showInlineError
                    >
                    </Form>
                </div>
            </div>
        );
    }
}
