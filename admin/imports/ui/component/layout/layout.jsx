import React from 'react';
import BaseComponent from '../../../lib/base/component/component.jsx';
import Naviation from './component/navigation/navigation.jsx';
import PropTypes from 'prop-types';

import './style.less';

export default class Layout extends BaseComponent
{
    static propTypes = {
        central: PropTypes.object,
        title: PropTypes.string,
        motd: PropTypes.string,
    };

    static defaultProps = {
        central: null,
        title: '',
        motd: '',
    };

    renderCentral()
    {
        return this.props.central;
    }

    render(props)
    {
        return (
            <div className="layout-map-full__central layout-map-full__central-body container">
                <div className="layout-map-full__central-row row">
                    <div className="layout-map-full__central-body-left col-xs-3">
                        <div className="layout-map-full__side">
                            {
                                _.isStringNotEmpty(this.props.motd)
                                &&
                                <blockquote className="margin-top_2x margin-top_2x">
                                    {this.props.motd}
                                </blockquote>
                            }
                            <Naviation
                                className="margin-bottom"
                            />
                        </div>
                    </div>
                    <div className="layout-map-full__central-body-right col-xs-9">
                        <div className="layout-map-full__central">
                            {
                                _.isStringNotEmpty(this.props.title)
                                &&
                                <h1>{this.props.title}</h1>
                            }
                            {this.renderCentral(props)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
