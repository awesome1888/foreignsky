import React from 'react';
//import ValidatedForm from 'uniforms-unstyled/ValidatedForm';
import AutoForm from 'uniforms-unstyled/AutoForm';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import BaseComponent from '../../../../lib/base/component/component.jsx';
import Map from '../../../../lib/base/map/index.js';

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
        map: PropTypes.object,
        model: PropTypes.object,
        isFragment: PropTypes.bool,
        submitButtonLabel: PropTypes.string,
        onSubmit: PropTypes.func,
    };

    static defaultProps = {
        className: '',
        model: {},
        isFragment: false,
        submitButtonLabel: 'Send',
        onSubmit: null,
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
            this.setState({
                model: {},
                error
            });
        });
    }

    getMap()
    {
        return this.props.map;
    }

    async getModel()
    {
        return this.props.model;
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
        const sourceModel = this.transformModelBack(model);

        if (_.isFunction(this.props.onSubmit)) {
            this.props.onSubmit(sourceModel);
        }

        return sourceModel;
    }

    renderRows()
    {
        const map = this.getMapTransformed();

        return map.map((attribute) => {

            if (attribute.isLinkAny())
            {
                attribute = map.makeRefAttribute(attribute);
            }

            return (
                <Row
                    key={attribute.getCode()}
                    attribute={attribute}
                />
            );
        })
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

        // console.dir(this.props);

        const tModel = this.transformModel();
        const tMap = this.getMapTransformed();
        if (!(tMap instanceof Map))
        {
            console.error('Not a map passed to the form');
            return null;
        }

        // console.dir(tModel);
        // console.dir(tMap);

        const body = (
            <div>
                {
                    _.isStringNotEmpty(this.props.backPath)
                    &&
                    <a href={this.props.backPath}>Back</a>
                }
                {
                    this.state.error
                    &&
                    <div className="form__error-message form__error-message_top">
                        Error occured: {this.state.error}
                    </div>
                }
                <div className="form__block">
                    <div className="form__block-inner">
                        {
                            this.renderRows()
                        }
                    </div>
                </div>
            </div>
        );

        if (this.props.isFragment)
        {
            return body;
        }

        // const schema = tMap.getSchema();
        // console.dir(schema);

        return (
            <AutoForm
                schema={tMap.getSchema()}
                model={tModel}
                onSubmit={this.onSubmit.bind(this)}
                className="form"
            >
                {body}
                <div style={{marginTop: '10px'}}>
                    <button type="submit">{this.props.submitButtonLabel}</button>
                </div>
            </AutoForm>
        );
    }
}
