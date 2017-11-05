import React from 'react';
import Map from '/imports/ui/component/map/index.jsx';
import ImageViewComponent from '/imports/ui/component/general/image-view/index.jsx';
import Util from '../lib/util.js';
import {DocHead} from 'meteor/kadira:dochead';
import PreRender from '../lib/prerender.js';
import {FlowRouter} from 'meteor/kadira:flow-router';

import Application from '../lib/base/application/application.jsx';

export default class FrontApplication extends Application
{
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

	toggleMap(way)
    {
	    if(this.map)
	    {
	        this.map.toggleBlock(way);
        }
    }

    showOverlay()
    {
        return !PreRender.isCrawler;
    }

    showIndicator()
    {
        return !PreRender.isCrawler;
    }

    renderExtras()
    {
        return [
            <Map
                ref={(instance) => {this.setMap(instance)}}
                center={{lat: 52.520764, lng: 13.409161}}
                zoom={15}
                useFakeMap={PreRender.isCrawler}
                key="1"
            />,
            <ImageViewComponent
                ref={(instance) => {this.setImageView(instance)}}
                key="2"
            />,
        ];
    }
}
