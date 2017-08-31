import React from 'react';
import BaseComponent from '../../../lib/base/component/component.jsx';
import PropTypes from 'prop-types';

import './style.less';

export default class Layout extends BaseComponent
{
    static propTypes = {
        central: PropTypes.object,
        title: PropTypes.string,
        backUrl: PropTypes.string,
    };

    static defaultProps = {
        central: null,
        title: '',
        backUrl: '',
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
        const backUrl = this.props.backUrl;
        
        return (
            <div>
                {
                    !!title
                    &&
                    <h1
                        className="ui dividing header layout__header"
                    >
                        <span ref={(ref) => {this._title = ref;}}>{title}</span>
                        {
                            _.isStringNotEmpty(backUrl)
                            &&
                            <a href={backUrl} className="layout__header-back" title="Back">
                                <span className="layout__header-back-icon" />
                            </a>
                        }
                    </h1>
                }
                <div className="layout__central-container">
                    {this.renderCentral(props)}
                </div>
            </div>
        );
    }
}
