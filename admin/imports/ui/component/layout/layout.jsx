import React from 'react';
import BaseComponent from '../../../lib/base/component/component.jsx';
import PropTypes from 'prop-types';

import './style.less';

export default class Layout extends BaseComponent
{
    static propTypes = {
        side: PropTypes.object,
        central: PropTypes.object,
    };

    static defaultProps = {
        side: null,
        central: null,
    };

    renderCentral()
    {
        return this.props.central;
    }

    renderSide()
    {
        return this.props.side;
    }

    render(props)
    {
        return (
            <div className="layout-map-full__central layout-map-full__central-body container">
                <div className="layout-map-full__central-row row">
                    <div className="layout-map-full__central-body-left col-xs-3">
                        <div className="layout-map-full__side">
                            Тут будет менюшечка, ну а пока - захардкоженные ссылочки
                            <br />
                            <br />
                            <br />
                            <a href="/article/list">Article</a>
                            <a href="/article.tag/list">Article tag</a>
                            <a href="/embed/list">Embed</a>
                            <a href="/file/list">File</a>
                            <br />
                            <a href="/shell">Shell</a>
                        </div>
                    </div>
                    <div className="layout-map-full__central-body-right col-xs-9">
                        <div className="layout-map-full__central">
                            {this.renderCentral(props)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
