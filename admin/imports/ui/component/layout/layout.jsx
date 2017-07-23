import React from 'react';
import BaseComponent from '../../../lib/base/component/component.js';
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
                            {this.renderSide(props)}
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
