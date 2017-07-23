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
			loaded: false,
            title: '',
		};

        this.setTitle('', false);

		this._indicator = null;
		this._imageView = null;

		this._idioticMessage = this.generateMOTD();
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

	wait(p)
	{
		if(this.overlay)
		{
			this.overlay.waitOne(p);
		}
		if(this.indicator)
		{
            this.indicator.waitOne(p);
        }

		return p;
	}

	makeTitle(title = '')
    {
        let newTitle = 'Admin panel';
        if (_.isStringNotEmpty(title)) {
            title = title.replace(/#DASH#/g, '–');
            newTitle = `${title} – ${newTitle}`;
        }

        return newTitle;
    }

    setTitle(title = '', updateState = true)
    {
        DocHead.setTitle(this.makeTitle(title));

        if (updateState)
        {
            this.setState({
                title: title,
            });
        }
    }

	static get instance()
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

    generateMOTD()
    {
        return _.sample([
            'This is my panel, I am The Admin, I do what I want!',
            'Uncorns sucks! I mean it!',
            'Do some good today. Or die. Whatever.',
            'This is only hard-coded text, and soon there will be more!',
            'Do not underestimate unpredictable idiots around.',
            'Man, get some sleep already!',
            'Тут будет менюшечка, ну а пока - захардкоженные ссылочки',
        ]);
    }

	componentWillMount()
	{
		App._instance = this;
	}

	componentDidMount()
	{
	    if(this.overlay)
        {
            this.overlay.waitAll();
        }

        // shit-fix
        if (this.indicator)
        {
            const p = new Promise((resolve) => {resolve()});
            this.indicator.waitOne(p);
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
                        title: this.state.title,
                        motd: this._idioticMessage,
					})}
				</div>
			</div>
		);
	}
}
