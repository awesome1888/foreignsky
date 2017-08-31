import React from 'react';
import BaseComponent from '../../../lib/base/component/component.jsx';
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
            <div>
                {
                    _.isStringNotEmpty(this.props.title)
                    &&
                    <h1 className="ui dividing header">{this.props.title}</h1>
                }
                <div className="layout__central-container">
                    {this.renderCentral(props)}
                </div>
            </div>
        );
    }
}
