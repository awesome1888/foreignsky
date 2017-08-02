import React from 'react';
//import ValidatedForm from 'uniforms-unstyled/ValidatedForm';
import AutoForm from 'uniforms-unstyled/AutoForm';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import BaseComponent from '../../../../lib/base/component/component.jsx';

import RendererString from './component/renderer/string/index.jsx';

import './style.less';

/**
 * The basic component for making forms: schema renderer
 * @abstract
 */
export default class Form extends BaseComponent
{
    getSchema()
    {
        throw new Error('Not implemented');
    }

    getSchemaTransformed()
    {
        return this.obtainSchema();
    }

    obtainSchema()
    {
        if (!this._cache.schema)
        {
            let schema = this.getSchema();
            if (!(schema instanceof SimpleSchema))
            {
                schema = new SimpleSchema(schema);
            }

            this._cache.schema = schema;
        }

        return this._cache.schema;
    }

    obtainModel()
    {
        return {title: 'Shit'};
    }

    onSubmit(data)
    {
        console.dir(data);
    }

    resolveControl(attribute)
    {
        if (attribute.renderer)
        {
            return attribute.renderer;
        }

        const type = attribute.type;

        if (type === String)
        {
            return RendererString;
        }
        if (type === Date)
        {
            return RendererDate;
        }
        if (type === Boolean)
        {
            return RendererBoolean;
        }

        // todo: standard renderers for: object and array of one type

        return RendererGeneric;
    }

    render()
    {
        return (
            <AutoForm
                schema={this.getSchemaTransformed()}
                model={this.obtainModel()}
                onSubmit={this.onSubmit.bind(this)}
                className="form"
            >
                <div className="form__block">
                    <div className="form__block-inner">

                        <div className="form__block-row-group">

                            <div className="form__row row">
                                <div className="form__column col-md-3 col-sm-12">
                                    <div className="form__label form__label_padded">
                                        Field 1
                                    </div>
                                </div>
                                <div className="form__column col-md-9 col-sm-12">
                                    <RendererString name="title" />
                                </div>
                            </div>

                        </div>


                    </div>
                </div>

                <div style={{'margin-top': '10px'}}>
                    <button type="submit">Send</button>
                </div>
            </AutoForm>
        );
    }
}
