import React from 'react';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

export default class RendererGeneric extends React.Component
{
    getName()
    {
        return this.props.name;
    }

    getValue()
    {
        return this.props.value;
    }

    hasError()
    {
        return _.isObject(this.props.error);
    }

    getErrorMessage()
    {
        return this.props.errorMessage;
    }

    getOnChange()
    {
        if (!_.isFunction(this.props.onChange))
        {
            return e => '';
        }

        return e => this.props.onChange(e.target.value);
    }
}
