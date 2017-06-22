import React from 'react';
import Header from '/imports/ui/component/header/index.jsx';
import Map from '/imports/ui/component/map/index.jsx';
import LoadOverlay from '/imports/ui/component/load.overlay/index.jsx';
import LoadIndicator from '/imports/ui/component/load.indicator/index.jsx';
import ImageViewComponent from '/imports/ui/component/general/image-view/index.jsx';
import Util from '/imports/lib/util.js';
import {DocHead} from 'meteor/kadira:dochead';
import PreRender from '/imports/lib/prerender.js';

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

	get overlay()
	{
		return this._overlay;
	}

	set overlay(ref)
	{
		if(!this._overlay)
		{
			this._overlay = ref;
		}
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

	get map()
	{
		return this._map;
	}

	set map(ref)
	{
		if(!this._map)
		{
			this._map = ref;
		}
	}

	get imageView()
	{
		if(!this._imageView)
		{
			return {
				open: Util.noop,
			};
		}

		return this._imageView;
	}

	set imageView(ref)
	{
		if(!this._imageView)
		{
			this._imageView = ref;
		}
	}

	mapToggleBlock(way)
    {
	    if(this.map)
	    {
	        this.map.toggleBlock(way);
        }
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

    setTitle(pageName = '')
    {
        let title = 'Еще один блог еще одной семьи, переехавшей в Берлин.';
        if (_.isStringNotEmpty(pageName)) {
            title = pageName+' – '+title;
        }
        DocHead.setTitle(title);
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
                    {
                        !PreRender.isCrawler
                        &&
                        <LoadOverlay
                            ref={(instance) => {this.overlay = instance;}}
                        />
                    }

                    <div className="layout__central layout__header">
						<Header />
                        {
                            !PreRender.isCrawler
                            &&
                            <LoadIndicator
                                ref={(instance) => {this.indicator = instance;}}
                            />
                        }
                    </div>
					{React.createElement(main, {
						route: routeProps,
					})}
				</div>
                {
                    <Map
                        ref={(instance) => {this.map = instance;}}
                        center={{lat: 52.520764, lng: 13.409161}}
                        zoom={15}
                        useFakeMap={PreRender.isCrawler}
                    />
                }
                <ImageViewComponent
					ref={(instance) => {this.imageView = instance;}}
				/>
			</div>
		);
	}
}