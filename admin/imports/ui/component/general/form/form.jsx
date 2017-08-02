import React from 'react';
//import ValidatedForm from 'uniforms-unstyled/ValidatedForm';
import AutoForm from 'uniforms-unstyled/AutoForm';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// import PropTypes from 'prop-types';
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

    render()
    {
        const model = this.obtainModel();
        if (model === null)
        {
            return null; // probably still loading
        }

        const schema = this.getSchemaTransformed();

        // getDefinition

        return (
            <AutoForm
                schema={schema}
                model={this.obtainModel()}
                onSubmit={this.onSubmit.bind(this)}
                className="form"
            >
                <div className="form__block">
                    <div className="form__block-inner">
                        {
                            _.map(schema.schema(), (attribute, field) => {
                                console.dir(attribute);
                                return (
                                    <Row
                                        key={field}
                                        attribute={attribute}
                                        field={field}
                                    />
                                );
                            })
                        }
                    </div>
                </div>

                <div style={{'margin-top': '10px'}}>
                    <button type="submit">Send</button>
                </div>
            </AutoForm>
        );
    }
}
