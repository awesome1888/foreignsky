import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';

class RendererBoolean extends RendererGeneric
{
    hasLabel()
    {
        return _.isStringNotEmpty(this.props.label);
    }

    getLabel()
    {
        return this.props.label || '';
    }

    renderInput()
    {
        const onChange = this.props.onChange;

        return (
            <input
                checked={this.getValue()}
                disabled={this.getDisabled()}
                name={this.getName()}
                onChange={() => this.getDisabled() || onChange(!this.getValue())}
                type="checkbox"
            />
        );
    }

    render()
    {
        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                {
                    this.hasLabel()
                    &&
                    <label>
                        {this.renderInput()}
                        {this.getLabel()}
                    </label>
                }
                {
                    !this.hasLabel()
                    &&
                    this.renderInput()
                }
            </Container>
        );
    }
}

export default connectField(RendererBoolean, {});
export const ControllerClass = RendererBoolean;
