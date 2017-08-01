import React from 'react';
// import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import Form from '../form/form.jsx';

/**
 * The basic component for making forms: schema renderer
 * @abstract
 */
export default class EntityForm extends Form
{
    getEntity()
    {
        throw new Error('Not implemented');
    }

    getSchema()
    {
        return this.getEntity().getCollection().getSchema();
    }
}
