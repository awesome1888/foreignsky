import React from 'react';
import BaseComponent from '../../../../lib/base/component/component.jsx';
import PropTypes from 'prop-types';

import Header from '../component/header/index.jsx';
import GlobalOverlay from '../../general/etc/global-overlay/index.jsx';
import GlobalLoadProgress from '../../general/etc/global-load-progress/index.jsx';

import ArticleListComponent from '../component/article.list/index.jsx';
import ImageViewer from '../../general/image-viewer/index.jsx';
import Map from '../component/map/index.jsx';
import PPNotification from '../component/privacy-policy-notification/index.jsx';

import PreRender from '../../../../lib/prerender.js';

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

    componentDidMount()
    {
        this.fire('application-layout-mounted');
    }

    getTitle()
    {
        return _.isStringNotEmpty(this.props.title) ? this.props.title : '';
    }

    render(props)
    {
        return (
            <div
                className="layout tall"
            >
                <GlobalOverlay
                    text="Типичный текст, который вы читаете, пока ждете загрузку Ж)"
                />

                <div className="layout__header">
                    <Header />
                    <GlobalLoadProgress />
                </div>

                <div className="layout-map-full__central layout-map-full__central-body container tall">
                    <div className="layout-map-full__central-row row tall">
                        <div className="layout-map-full__central-body-left col-xs-3">
                            <div className="layout-map-full__side">
                                <ArticleListComponent />
                            </div>
                        </div>
                        <div className="layout-map-full__central-body-right col-xs-9 tall">
                            <div className="layout-map-full__central tall">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>

                <Map
                    center={{lat: 52.520764, lng: 13.409161}}
                    zoom={15}
                    useFakeMap={PreRender.isCrawler()}
                />

                <ImageViewer />
                <PPNotification />
            </div>
        );
    }
}
