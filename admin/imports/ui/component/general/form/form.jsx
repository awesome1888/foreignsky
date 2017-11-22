import React from 'react';
//import ValidatedForm from 'uniforms-unstyled/ValidatedForm';
import AutoForm from 'uniforms-unstyled/AutoForm';
import FixedPane from '../etc/fixed-pane/index.jsx';

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
        map: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        model: PropTypes.object,
        isFragment: PropTypes.bool,
        submitButtonLabel: PropTypes.string,
        submitButtonType: PropTypes.string,
        onSubmit: PropTypes.func,
        onValidate: PropTypes.func,
        borderColor: PropTypes.string,
        showFooter: PropTypes.bool,
        error: PropTypes.string,
        extraButtons: PropTypes.object,
        stickFooter: PropTypes.bool,
    };

    static defaultProps = {
        className: '',
        model: {},
        isFragment: false,
        submitButtonLabel: 'Save',
        submitButtonType: 'submit',
        onSubmit: null,
        onValidate: null,
        borderColor: '',
        showFooter: true,
        error: null,
        extraButtons: null,
        stickFooter: true,
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
        this.getModel().then((model) => {
            this.setState({
                model
            });
        }).catch((error) => {
            this.setState({
                model: {},
                error
            });
        });
    }

    onSubmitClick()
    {
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

    /**
     * Transforms the map from the database structure into the UI structure, before displaying
     * @param map
     * @returns {*}
     */
    // todo: probably rename to transformMapDB2UI (or smth)
    transformMap(map)
    {
        return map;
    }

    // todo: this is wrong. model transformation should be in form of model => newModel
    // todo: DONT get confused with this.onTransform()
    // todo: probably rename to transformModelDB2UI (or smth)
    transformModel()
    {
        return this.state.model;
    }

    /**
     * Transforms the map from the UI structure back into the database structure, before saving
     * @param model
     * @returns {*}
     */
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

    getModelTransformed()
    {
        // todo: cache here!
        return this.state.model;
    }

    getForm()
    {
        return this._form || null;
    }

    getFormNative()
    {
        return $(`.form_${this.getId()} form`).get(0);
    }

    getFormDataInstance()
    {
        return new FormData(this.getFormNative());
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

    /**
     * Override this if you need to show form errors in a custom way, or perform additional validation
     * @param model
     * @param errors
     * @param callback
     * @returns {*}
     */
    onValidate(model, errors, callback) {
        // sniff form errors here
        if (_.isFunction(this.props.onValidate))
        {
            this.props.onValidate(errors);
        }

        return callback();
    }

    /**
     * Override this if you need to make dependencies between model fields
     * @param mode
     * @param model
     * @returns {*}
     */
    onTransform(mode, model)
    {
        return model;
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

    isFooterSticky()
    {
        return this.props.stickFooter;
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

            // todo: terrible idea. we should not substitute one attribute with another HERE,
            // todo: we need to solve this particular case inside the specific renderer itself
            // todo: make amends!
            if (this.isAttribute(attribute) && attribute.isLinkAny())
            {
                attribute = map.makeRefAttribute(attribute);
            }

            return (
                <Row
                    key={code}
                    attribute={attribute}
                    form={this}
                    map={map}
                />
            );
        })
    }

    renderExtraButtons()
    {
        return this.props.extraButtons;
    }

    renderFooterButtons()
    {
        return (
            <div className="group_x">
                <Button
                    color="green"
                    size="large"
                    type={this.props.submitButtonType}
                    onClick={this.onSubmitClick.bind(this)}
                >
                    {this.props.submitButtonLabel}
                </Button>
                {
                    this.renderExtraButtons()
                }
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
        );
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
            <div className={`form_${this.getId()}`}>
                <AutoForm
                    schema={tMap.getSchema()}
                    model={tModel}
                    onSubmit={this.onSubmit.bind(this)}
                    className="ui big form"
                    ref={(reference) => {this._form = reference;}}
                    onValidate={this.onValidate.bind(this)}
                    modelTransform={this.onTransform.bind(this)}
                >
                    {body}
                    {this.props.children || null}
                    {
                        this.props.showFooter
                        &&
                        <div className="form__footer">
                            {
                                this.isFooterSticky()
                                &&
                                <FixedPane
                                    paneClassName="form__footer-bar"
                                >
                                    {this.renderFooterButtons()}
                                </FixedPane>
                            }
                            {
                                !this.isFooterSticky()
                                &&
                                <div className="form__footer-bar">
                                    {this.renderFooterButtons()}
                                </div>
                            }
                        </div>
                    }
                </AutoForm>
            </div>
        );
    }
}
