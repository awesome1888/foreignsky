import React from 'react';
//import ValidatedForm from 'uniforms-unstyled/ValidatedForm';
import AutoForm from 'uniforms-unstyled/AutoForm';

import { Button } from 'semantic-ui-react';
// import { Button, Checkbox, Form } from 'semantic-ui-react';

import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import BaseComponent from '../../../../lib/base/component/component.jsx';
import Map from '../../../../lib/base/map/index.js';
import Attribute from '../../../../lib/base/map/attribute/index.js';
import AttributeGroup from './component/attribute-group/index.jsx';

import Row from './component/row/index.jsx';

import './style.less';

/**
 * The basic component for making forms: schema renderer
 * @abstract
 */
export default class Form extends BaseComponent
{
    _map = null;

    static propTypes = {
        className: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object,
        ]),
        map: PropTypes.oneOfType([PropTypes.object]),
        model: PropTypes.object,
        isFragment: PropTypes.bool,
        submitButtonLabel: PropTypes.string,
        onSubmit: PropTypes.func,
        onValidate: PropTypes.func,
        borderColor: PropTypes.string,
        showFooter: PropTypes.bool,
        error: PropTypes.string,
    };

    static defaultProps = {
        className: '',
        model: {},
        isFragment: false,
        submitButtonLabel: 'Save',
        onSubmit: null,
        onValidate: null,
        borderColor: '',
        showFooter: true,
        error: null,
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
        if (!this._map)
        {
            this._map = this.props.map;
            if (_.isArray(this._map))
            {
                this._map = new Map(this._map);
            }

            if (!this._map instanceof Map)
            {
                throw new TypeError('Illegal map passed');
            }
        }

        return this._map;
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

    submit()
    {
        return this.getForm().submit();
    }

    onSubmit(model)
    {
        const sourceModel = this.transformModelBack(model);

        if (_.isFunction(this.props.onSubmit)) {
            this.props.onSubmit(sourceModel);
        }

        return sourceModel;
    }

    onValidate(model, errors, callback) {
        // sniff form errors here
        if (_.isFunction(this.props.onValidate))
        {
            this.props.onValidate(errors);
        }

        return callback();
    }

    isFragment()
    {
        return !!this.props.isFragment;
    }

    isAttribute(a)
    {
        return a instanceof Attribute;
    }

    isAttributeGroup(a)
    {
        return a instanceof AttributeGroup;
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

    hasError()
    {
        return _.isStringNotEmpty(this.props.error) || _.isStringNotEmpty(this.state.error);
    }

    getError()
    {
        return this.props.error || this.state.error;
    }

    renderRows()
    {
        const map = this.getMapTransformed();
        const toRender = {};

        // we need to scan for groups first, to mark attributes that will be rendered in groups
        map.forEach((attribute) => {
            if (this.isAttributeGroup(attribute))
            {
                Object.assign(toRender, attribute.getAttributeCodesObject());
            }
        });

        let code;
        return map.map((attribute) => {
            code = attribute.getCode();

            if (code in toRender)
            {
                return null;
            }
            toRender[code] = true;

            if (this.isAttribute(attribute) && attribute.isLinkAny())
            {
                attribute = map.makeRefAttribute(attribute);
            }

            return (
                <Row
                    key={code}
                    attribute={attribute}
                    form={this}
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
                    this.hasError()
                    &&
                    <div className="form__error-message margin-b_x">
                        {this.getError()}
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
                onValidate={this.onValidate.bind(this)}
            >
                {body}
                {
                    this.props.showFooter
                    &&
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
                }
            </AutoForm>
        );
    }
}
