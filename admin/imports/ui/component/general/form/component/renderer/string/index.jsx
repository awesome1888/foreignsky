import React from 'react';
import connectField from 'uniforms/connectField';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';

class RendererString extends RendererGeneric
{
    render()
    {
        return (
            <Container
                errorProps={this.props}
            >
                <input
                    type="text"
                    name={this.getName()}
                    onChange={this.getOnChange()}
                    value={this.getValue()}
                />
            </Container>
        );
    }
}

export default connectField(RendererString, {});