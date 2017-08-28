import React from 'react';
import BaseComponent from '../../../lib/base/component/component.jsx';
import Naviation from './component/navigation/navigation.jsx';
import PropTypes from 'prop-types';

// import './style.less';

export default class Layout extends BaseComponent
{
    static propTypes = {
        central: PropTypes.object,
        title: PropTypes.string,
    };

    static defaultProps = {
        central: null,
        title: '',
    };

    renderCentral()
    {
        return this.props.central;
    }

    render(props)
    {
        return (
            <div className="ui container">
                <div className="ui equal width grid">
                    <div className="row">
                        <div className="
                            computer only
                            tablet only
                            column
                        ">
                            <div className="layout-map-full__side">
                                <Naviation
                                    className="margin-bottom"
                                />
                            </div>
                        </div>
                        <div className="
                            twelve wide computer
                            twelve wide tablet
                            sixteen wide mobile
                            siz
                            column
                        ">
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
            </div>
        );
    }
}
