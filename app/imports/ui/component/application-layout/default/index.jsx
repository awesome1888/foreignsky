import React from 'react';
import BaseComponent from '../../../../lib/base/component/component.jsx';
import PropTypes from 'prop-types';

import Header from '../component/header/index.jsx';
import GlobalOverlay from '../../general/etc/global-overlay/index.jsx';
import GlobalLoadProgress from '../../general/etc/global-load-progress/index.jsx';

import ArticleListComponent from '../component/article.list/index.jsx';
import ImageViewComponent from '../component/image-view/index.jsx';
import Map from '../component/map/index.jsx';

// import Map from '/imports/ui/component/map/index.jsx';
// import ImageViewComponent from '/imports/ui/component/general/image-view/index.jsx';
// import PreRender from '../lib/prerender.js';
// import {DocHead} from 'meteor/kadira:dochead';

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
        const title = this.getTitle();
        const backUrl = this.props.backUrl;

        return (
            <div
                className="layout"
            >
                <GlobalOverlay
                    text="Типичный текст, который вы читаете, пока ждете загрузку Ж)"
                />

                <div className="layout__header">
                    <Header />
                    <GlobalLoadProgress />
                </div>

                <div className="layout-map-full__central layout-map-full__central-body container">
                    <div className="layout-map-full__central-row row">
                        <div className="layout-map-full__central-body-left col-xs-3">
                            <div className="layout-map-full__side">
                                <ArticleListComponent />
                            </div>
                        </div>
                        <div className="layout-map-full__central-body-right col-xs-9">
                            <div className="layout-map-full__central">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>

                <Map
                    // ref={(instance) => {this.setMap(instance)}}
                    center={{lat: 52.520764, lng: 13.409161}}
                    zoom={15}
                    //useFakeMap={PreRender.isCrawler}
                />

                <ImageViewComponent
                    //ref={(instance) => {this.setImageView(instance)}}
                />
            </div>
        );
    }

    // renderExtras()
    // {
    //     return [
    //     ];
    // }

    // setMap(ref)
    // {
    // if(!this._map)
    // {
    // 	this._map = ref;
    // }
    // }
    //
    // getImageView()
    // {
    // if(!this._imageView)
    // {
    // 	return {
    // 		open: Util.noop,
    // 	};
    // }
    //
    // return this._imageView;
    // }
    //
    // setImageView(ref)
    // {
    // if(!this._imageView)
    // {
    // 	this._imageView = ref;
    // }
    // }
    //
    // toggleMap(way)
    // {
    //    if(this.map)
    //    {
    //        this.map.toggleBlock(way);
    //     }
    // }
    //
    // showOverlay()
    // {
    //     return !PreRender.isCrawler;
    // }
    //
    // showIndicator()
    // {
    //     return !PreRender.isCrawler;
    // }
}
