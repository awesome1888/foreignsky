import React from 'react';
import ValidatedForm from 'uniforms-unstyled/ValidatedForm';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import BaseComponent from '../../../../lib/base/component/component.jsx';

import SampleRenderer from './component/attribute/string/index.jsx';

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
        return (
            <ValidatedForm
                schema={this.getSchemaTransformed()}
                model={this.obtainModel()}
                onSubmit={this.onSubmit.bind(this)}
            >
                <div className="row">
                    <div className="col-sm-4">
                        Title
                    </div>
                    <div className="col-sm-8">
                        <SampleRenderer name="title" />
                    </div>
                </div>

                <div>
                    <button type="submit">Send</button>
                </div>
            </ValidatedForm>
        );
    }
}
