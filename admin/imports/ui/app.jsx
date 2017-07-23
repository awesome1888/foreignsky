import React from 'react';
// import Header from '/imports/ui/component/header/index.jsx';
// import Map from '/imports/ui/component/map/index.jsx';
// import LoadOverlay from '/imports/ui/component/load.overlay/index.jsx';
// import LoadIndicator from '/imports/ui/component/load.indicator/index.jsx';
// import ImageViewComponent from '/imports/ui/component/general/image-view/index.jsx';
import Util from '../lib/util.js';
import {DocHead} from 'meteor/kadira:dochead';
// import PreRender from '../lib/prerender.js';
import {FlowRouter} from 'meteor/kadira:flow-router';

export default class App extends React.Component {

	constructor(props)
	{
		super(props);
		this.state = {
			loaded: false
		};

		this._indicator = null;
		this._imageView = null;

		this.setTitle();
	}

	get indicator()
	{
		return this._indicator;
	}

	set indicator(ref)
	{
		if(!this._indicator)
		{
			this._indicator = ref;
		}
	}

	get query() {
	    return FlowRouter.current().queryParams;
    }

	setLoading(p)
	{
		if(this.overlay)
		{
			this.overlay.waitMe(p);
		}
		if(this.indicator)
		{
            this.indicator.addProcess(p);
        }

		return p;
	}

    setTitle(title = '')
    {
        let newTitle = 'Admin panel';
        if (_.isStringNotEmpty(title)) {
            title = title.replace(/#DASH#/g, '–');
            newTitle = `${title} – ${newTitle}`;
        }
        DocHead.setTitle(newTitle);
    }

	static get instance()
	{
		if(this._instance)
		{
			return this._instance;
		}

		// return mock
		return {
			setLoading: function(){},
		};
	}

	componentWillMount()
	{
		App._instance = this;
	}

	componentDidMount()
	{
	    if(this.overlay)
        {
            this.overlay.wait();
        }
	}

	render() {
		const {main, routeProps} = this.props;

        return (
            <div id="app">
                <div className="layout">
                    {React.createElement(main, {
                        route: routeProps,
                    })}
                </div>
            </div>
        );

		// return (
		// 	<div id="app">
		// 		<div className="layout">
         //            {
         //                !PreRender.isCrawler
         //                &&
         //                <LoadOverlay
         //                    ref={(instance) => {this.overlay = instance;}}
         //                />
         //            }
        //
         //            <div className="layout__central layout__header">
		// 				<Header />
         //                {
         //                    !PreRender.isCrawler
         //                    &&
         //                    <LoadIndicator
         //                        ref={(instance) => {this.indicator = instance;}}
         //                    />
         //                }
         //            </div>
		// 			{React.createElement(main, {
		// 				route: routeProps,
		// 			})}
		// 		</div>
         //        {
         //            <Map
         //                ref={(instance) => {this.map = instance;}}
         //                center={{lat: 52.520764, lng: 13.409161}}
         //                zoom={15}
         //                useFakeMap={PreRender.isCrawler}
         //            />
         //        }
         //        <ImageViewComponent
		// 			ref={(instance) => {this.imageView = instance;}}
		// 		/>
		// 	</div>
		// );
	}
}