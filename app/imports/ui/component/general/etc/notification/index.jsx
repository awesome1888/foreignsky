import React from 'react';
import classnames from 'classnames';
import BaseComponent from '../../../../../lib/base/component/component.jsx';
import clone from 'clone';

import './style.less';

export default class Notification extends BaseComponent
{
    TYPE_ERROR = 1;
    TYPE_NOTIFICATION = 2;

    constructor(props)
    {
        super(props);

        this.state = {
            notifications: [],
        };

        this.on('notify', this.onNotify.bind(this));
    }

    onNotify(e, notification)
    {
        const isError = notification instanceof Error;
        const message = notification.message;
        if (!_.isStringNotEmpty(message))
        {
            return;
        }

        const notifications = clone(this.state.notifications, false);
        notifications.push({
            type: isError ? this.TYPE_ERROR : this.TYPE_NOTIFICATION,
            message,
        });

        this.setState({
            notifications,
        });
    }

    render()
    {
        console.dir(this.state.notifications);

        return (
            <div
                className={classnames(
                    '',
                )}
            >
                <div
                    className="notification notification__error"
                >
                    <div className="margin-b_x">
                        Error occured
                    </div>
                </div>
            </div>
        );
    }
}
