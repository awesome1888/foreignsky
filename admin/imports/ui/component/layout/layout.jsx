import React from 'react';
import BaseComponent from '../../../lib/base/component/component.jsx';
import PropTypes from 'prop-types';

import Header from '../header/index.jsx';
import LoadOverlay from '../load-overlay/index.jsx';
import LoadIndicator from '../load-indicator/index.jsx';
import Navigation from '../navigation/navigation.jsx';

import './style.less';

export default class Layout extends BaseComponent
{
    static propTypes = {
        central: PropTypes.object,
        title: PropTypes.string,
        backUrl: PropTypes.string,

        showOverlay: PropTypes.bool,
        showIndicator: PropTypes.bool,
    };

    static defaultProps = {
        central: null,
        title: '',
        backUrl: '',

        showOverlay: true,
        showIndicator: true,
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

    showOverlay()
    {
        return !!this.props.showOverlay;
    }

    showIndicator()
    {
        return !!this.props.showIndicator;
    }

    getOverlay()
    {
        return this._overlay;
    }

    setOverlay(ref)
    {
        if(!this._overlay)
        {
            this._overlay = ref;
        }
    }

    getIndicator()
    {
        return this._indicator;
    }

    setIndicator(ref)
    {
        if(!this._indicator)
        {
            this._indicator = ref;
        }
    }

    getTitle()
    {
        return _.isStringNotEmpty(this.props.title) ? this.props.title : '';
    }

    renderCentral()
    {
        return this.props.central;
    }

    render(props)
    {
        const title = this.getTitle();
        const backUrl = this.props.backUrl;

        return (
            <div
                className="layout"
            >
                {
                    this.showOverlay()
                    &&
                    <LoadOverlay
                        ref={(instance) => {this.setOverlay(instance)}}
                    />
                }

                <Header />
                {
                    this.showIndicator()
                    &&
                    <LoadIndicator
                        ref={(instance) => {this.setIndicator(instance)}}
                    />
                }

                <div className="ui container">
                    <div className="ui equal width grid">
                        <div className="row">
                            <div className="
                                computer only
                                tablet only
                                column
                            ">
                                <Navigation
                                    className="margin-bottom"
                                />
                            </div>
                            <div className="
                                twelve wide computer
                                twelve wide tablet
                                sixteen wide mobile
                                siz
                                column
                            ">
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
