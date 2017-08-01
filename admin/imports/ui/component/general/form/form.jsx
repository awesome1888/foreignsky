import React from 'react';
// import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import BaseComponent from '../../../../lib/base/component/component.jsx';

/**
 * The basic component for making forms
 * @abstract
 */
export default class Form extends BaseComponent
{
    render()
    {
        return (<div>Form</div>);
    }
}