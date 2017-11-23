/* eslint-disable class-methods-use-this */

// import PropTypes from 'prop-types';
import React from 'react';
// import classnames from 'classnames';
import BaseComponent from '../../../../../lib/base/component/component.jsx';
import Cookie from 'js-cookie';

import './style.less';

export default class PrivacyPolicyNotification extends BaseComponent {

    static propTypes = {
    };

    static defaultProps = {
    };

    constructor(props)
    {
        super(props);

        this.extendState({
            shown: Cookie.get('pp-n') !== '-1',
        });
    }

    onCloseClick()
    {
        Cookie.set('pp-n', '-1', { expires: 999999 });
        this.setState({
            shown: false,
        });
    }

    render()
    {
        if (!this.state.shown)
        {
            return null;
        }

        return (
            <div
                className="privacy-policy-notification"
            >
                <div className="margin-b_x">
                    <div className="margin-b_x0p5">
                        Пссст! Этот веб-сайт использует Cookie.
                    </div>
                    Вы даете свое согласие на использование Cookie, закрывая данное сообщение и оставаясь на нашем веб-сайте :)
                </div>
                <div className="group_x">
                    <a className="inline-block" href="/privacy-policy">Узнать подробнее</a>
                    <a
                        className="inline-block"
                        href=""
                        onClick={this.onCloseClick.bind(this)}
                    >
                        Закрыть
                    </a>
                </div>
            </div>
        );
    }
}