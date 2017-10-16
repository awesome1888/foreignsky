/* eslint-disable class-methods-use-this */

import React from 'react';
import { Button } from 'semantic-ui-react';
import User from '../../../api/user/entity/entity.client.js';

import './style.less';

export default class Header extends React.Component
{
	static propTypes = {
		//appLoaded: PropTypes.boolean,
	};

	static defaultProps = {
		//appLoaded: false
	};

	render()
	{
	    const authorzed = User.isAuthorized();
	    const ready = User.isReady();
	    let user = {};
	    if (ready)
	    {
	        user = User.get();
	    }

		return (
            <div className="ui container">
                <div className="ui grid">
                    <div className="header__row row">
                        <div
                            className="
                                left floated five wide column
                            "
                        >
                            <a
                                className="header__logo"
                                href="/"
                            >
                                Admin
                            </a>

                        </div>
                        <div
                            className="
                                right floated five wide column
                            "
                        >
                            {
                                ready
                                &&
                                <div
                                    className="header__buttons"
                                >
                                    <div className="header__whoami">
                                        {
                                            authorzed
                                            &&
                                            <a href={`/entity/user/${User.getId()}/`}>{user.getFullName()}</a>
                                        }
                                        {
                                            !authorzed
                                            &&
                                            <span className="f-color_red-orange">Guest User</span>
                                        }
                                    </div>
                                    {
                                        authorzed
                                        &&
                                        <Button
                                            size={'mini'}
                                            href="/logout"
                                        >
                                            Logout
                                        </Button>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
		);
	}
}
