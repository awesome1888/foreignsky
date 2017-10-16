import React from 'react';
import BaseComponent from '../../../../lib/base/component/component.jsx';
import PropTypes from 'prop-types';

import Header from '../../header/index.jsx';
// import GlobalOverlay from '../../general/etc/global-overlay/index.jsx';
import GlobalLoadProgress from '../../general/etc/global-load-progress/index.jsx';
import Navigation from '../../navigation/navigation.jsx';

// import './style.less';

export default class DefaultApplicationLayout extends BaseComponent
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

    getTitle()
    {
        return _.isStringNotEmpty(this.props.title) ? this.props.title : '';
    }

    render(props)
    {
        const title = this.getTitle();
        const backUrl = this.props.backUrl;

        return (
            <div
                className="layout"
            >
                {/*<GlobalOverlay />*/}
                <Header />
                <GlobalLoadProgress />

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
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
