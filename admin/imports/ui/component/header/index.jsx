/* eslint-disable class-methods-use-this */

import React from 'react';
import { Button } from 'semantic-ui-react';

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
                            <div
                                className="header__buttons"
                            >
                                <Button
                                    size={'mini'}
                                    href="/logout"
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		);
	}
}
