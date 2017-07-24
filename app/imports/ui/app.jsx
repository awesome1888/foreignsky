import React from 'react';
import Header from '/imports/ui/component/header/index.jsx';
import Map from '/imports/ui/component/map/index.jsx';
import LoadOverlay from '/imports/ui/component/load.overlay/index.jsx';
import LoadIndicator from '/imports/ui/component/load.indicator/index.jsx';
import ImageViewComponent from '/imports/ui/component/general/image-view/index.jsx';
import Util from '../lib/util.js';
import {DocHead} from 'meteor/kadira:dochead';
import PreRender from '../lib/prerender.js';
import {FlowRouter} from 'meteor/kadira:flow-router';

export default class App extends React.Component {

	constructor(props)
	{
		super(props);
		this.state = {
			loaded: false
		};

		this._overlay = null;
		this._map = null;
		this._indicator = null;
		this._imageView = null;

		this.setTitle();
		this.setDescription();
		this.setKeywords();
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

	getMap()
	{
		return this._map;
	}

	setMap(ref)
	{
		if(!this._map)
		{
			this._map = ref;
		}
	}

	getImageView()
	{
		if(!this._imageView)
		{
			return {
				open: Util.noop,
			};
		}

		return this._imageView;
	}

	setImageView(ref)
	{
		if(!this._imageView)
		{
			this._imageView = ref;
		}
	}

	getQuery() {
	    return FlowRouter.current().queryParams;
    }

	toggleMap(way)
    {
	    if(this.map)
	    {
	        this.map.toggleBlock(way);
        }
    }

	wait(p)
	{
		if(this.getOverlay())
		{
			this.getOverlay().waitOne(p);
		}
		if(this.getIndicator())
		{
            this.getIndicator().waitOne(p);
        }

		return p;
	}

    setTitle(title = '')
    {
        let newTitle = 'Еще один блог еще одной семьи, переехавшей в Берлин.';
        if (_.isStringNotEmpty(title)) {
            title = title.replace(/#DASH#/g, '–');
            newTitle = `${title} – ${newTitle}`;
        }
        DocHead.setTitle(newTitle);
    }

    setDescription(text = '')
    {
        DocHead.addMeta({
            name: "description",
            content: _.isStringNotEmpty(text) ? text : 'Еще один блог еще одной семьи, переехавшей в Берлин.',
        });
    }

    setKeywords(keywords = [])
    {
        let kw = [
            'берлин','блог','город','поездка','достопримечательности',
            'места','памятники','статьи','экскурсии','германия',
        ];
        if (_.isArrayNotEmpty(keywords))
        {
            kw = keywords;
        }

        DocHead.addMeta({
            name: "keywords",
            content: kw.join(', '),
        });
    }

	static getInstance()
	{
		if(this._instance)
		{
			return this._instance;
		}

		// return mock
		return {
			wait: function(){},
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

        // shit-fix
        if (this.getIndicator())
        {
            const p = new Promise((resolve) => {resolve()});
            this.getIndicator().waitOne(p);
        }
	}

	render() {
		const {main, routeProps} = this.props;

		return (
			<div id="app">
				<div className="layout">
                    {
                        !PreRender.isCrawler
                        &&
                        <LoadOverlay
                            ref={(instance) => {this.setOverlay(instance)}}
                        />
                    }

                    <div className="layout__central layout__header">
						<Header />
                        {
                            !PreRender.isCrawler
                            &&
                            <LoadIndicator
                                ref={(instance) => {this.setIndicator(instance)}}
                            />
                        }
                    </div>
					{React.createElement(main, {
						route: routeProps,
					})}
				</div>
                {
                    <Map
                        ref={(instance) => {this.setMap(instance)}}
                        center={{lat: 52.520764, lng: 13.409161}}
                        zoom={15}
                        useFakeMap={PreRender.isCrawler}
                    />
                }
                <ImageViewComponent
					ref={(instance) => {this.setImageView(instance)}}
				/>
			</div>
		);
	}
}