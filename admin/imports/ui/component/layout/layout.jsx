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

    _title = null;

    constructor(props)
    {
        super(props);
        this.on('set-title', (e, title) => {
            if (this._title)
            {
                this._title.innerHTML = title;
            }
        });
    }

    renderCentral()
    {
        return this.props.central;
    }

    getTitle()
    {
        return _.isStringNotEmpty(this.props.title) ? this.props.title : '';
    }

    render(props)
    {
        const title = this.getTitle();

        return (
            <div>
                {
                    !!title
                    &&
                    <h1
                        className="ui dividing header"
                        ref={(ref) => {this._title = ref;}}
                    >
                        {title}
                    </h1>
                }
                <div className="layout__central-container">
                    {this.renderCentral(props)}
                </div>
            </div>
        );
    }
}
