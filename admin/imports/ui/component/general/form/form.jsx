import React from 'react';
//import ValidatedForm from 'uniforms-unstyled/ValidatedForm';
import AutoForm from 'uniforms-unstyled/AutoForm';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import classNames from 'classnames';

import { Button } from 'semantic-ui-react';
// import { Button, Checkbox, Form } from 'semantic-ui-react';

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
        borderColor: PropTypes.string,
    };

    static defaultProps = {
        className: '',
        model: {},
        isFragment: false,
        submitButtonLabel: 'Send',
        onSubmit: null,
        borderColor: '',
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

    getForm()
    {
        return this._form || null;
    }

    onSubmit(model)
    {
        const sourceModel = this.transformModelBack(model);

        if (_.isFunction(this.props.onSubmit)) {
            this.props.onSubmit(sourceModel);
        }

        return sourceModel;
    }

    // onValidate(model, errors, callback) {
    //     // sniff form errors here
    //
    //     return callback();
    // }

    isFragment()
    {
        return !!this.props.isFragment;
    }

    getBorderColor()
    {
        return this.props.borderColor;
    }

    pickColor()
    {
        const bc = this.getBorderColor();
        if (bc)
        {
            return bc;
        }

        if (!this._cache.color)
        {
            this._cache.color = _.sample([
                'blue',
                'green',
                'yellow',
                'orange',
                'olive',
            ]);
        }

        return this._cache.color;
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
        const isFragment = this.isFragment();
        
        const model = this.state.model;
        if (model === null)
        {
            // probably the model is still loading
            return (<span>Loading...</span>);
        }

        const tModel = this.transformModel();
        const tMap = this.getMapTransformed();
        if (!(tMap instanceof Map))
        {
            console.error('Not a map passed to the form');
            return null;
        }

        // console.dir(tModel);
        // console.dir(tMap);

        const className = ['form__body'];
        if (isFragment) {
            className.push('form__body_fragment');
            className.push(`form__body_fragment_color_${this.pickColor()}`);
        }

        const body = (
            <div
                className={className.join(' ')}
            >
                {
                    this.state.error
                    &&
                    <div className="form__error-message form__error-message_top">
                        Error occured: {this.state.error}
                    </div>
                }
                {
                    this.renderRows()
                }
            </div>
        );

        if (isFragment)
        {
            return body;
        }

        return (
            <AutoForm
                schema={tMap.getSchema()}
                model={tModel}
                onSubmit={this.onSubmit.bind(this)}
                className="ui big form"
                ref={(reference) => {this._form = reference;}}
                // onValidate={this.onValidate.bind(this)}
            >
                {body}
                <div className="form__footer">
                    <div className="group_x2">
                        <Button color="green" size="large">
                            {this.props.submitButtonLabel}
                        </Button>
                        {
                            _.isStringNotEmpty(this.props.backPath)
                            &&
                            <a
                                href={this.props.backPath}
                                className="form__footer-back"
                            >
                                Back
                            </a>
                        }
                    </div>
                </div>
            </AutoForm>
        );
    }
}
