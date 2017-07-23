import React from 'react';
import Header from '../ui/component/header/index.jsx';
import LoadOverlay from '../ui/component/load.overlay/index.jsx';
import LoadIndicator from '../ui/component/load.indicator/index.jsx';
import {DocHead} from 'meteor/kadira:dochead';
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
                    <LoadOverlay
                        ref={(instance) => {this.overlay = instance;}}
                    />

                    <div className="layout__central layout__header">
						<Header />
                        <LoadIndicator
                            ref={(instance) => {this.indicator = instance;}}
                        />
                    </div>
					{React.createElement(main, {
						route: routeProps,
					})}
				</div>
			</div>
		);
	}
}