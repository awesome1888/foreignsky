import React from 'react';
//import ValidatedForm from 'uniforms-unstyled/ValidatedForm';
import AutoForm from 'uniforms-unstyled/AutoForm';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import BaseComponent from '../../../../lib/base/component/component.jsx';

import Row from './component/row/index.jsx';

import './style.less';

/**
 * The basic component for making forms: schema renderer
 * @abstract
 */
export default class Form extends BaseComponent
{
    static propTypes = {
        className: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object,
        ]),
        map: PropTypes.array,
        model: PropTypes.object,
    };

    static defaultProps = {
        className: '',
        map: [],
        model: {},
    };

    constructor(props)
    {
        super(props);
        this.extendState({
            model: null,
            error: null,
        });
    }

    componentDidMount()
    {
        this.getModel().then((
            model
        ) => {
            this.setState({
                model
            });
        }, (error) => {
            console.error(error);
            this.setState({
                model: {},
                error
            });
        });
    }

    getMap()
    {
        return this.props.map || [];
    }

    async getModel()
    {
        return this.props.model || {};
    }

    transformMap(map)
    {
        return map;
    }

    transformModel()
    {
        return this.state.model;
    }

    transformModelBack(model)
    {
        return model;
    }

    getMapTransformed()
    {
        if (!this._cache.map)
        {
            this._cache.map = this.transformMap(this.getMap());
            // todo: pre-sort here by order!!!
        }

        return this._cache.map;
    }

    onSubmit(model)
    {
        const sourceModel = this.transformModelBack();

        if (_.isFunction(this.props.onSubmit)) {
            this.props.onSubmit(sourceModel);
        }

        return sourceModel;
    }

    render()
    {
        const model = this.state.model;
        if (model === null)
        {
            // probably the model is still loading
            return (<span>Loading...</span>);
        }
        
        // console.dir(this.getMapTransformed());
        // console.dir(this.transformModel());

        const tModel = this.transformModel();
        console.dir(tModel);

        return (
            <AutoForm
                schema={this.getMapTransformed().getSurrogateSchema()}
                model={tModel}
                onSubmit={this.onSubmit.bind(this)}
                className="form"
            >
                {
                    this.state.error
                    &&
                    <div style={{color: 'red'}}>
                        Error occured: {this.state.error}
                    </div>
                }
                <div className="form__block">
                    <div className="form__block-inner">
                        {
                            this.getMapTransformed().map((attribute) => {
                                return (
                                    <Row
                                        key={attribute.getCode()}
                                        attribute={attribute}
                                    />
                                );
                            })
                        }
                    </div>
                </div>

                <div style={{marginTop: '10px'}}>
                    <button type="submit">Send</button>
                </div>
            </AutoForm>
        );
    }
}
