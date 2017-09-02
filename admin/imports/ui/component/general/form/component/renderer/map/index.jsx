import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';

import Form from '../../../form.jsx';

class RendererMap extends RendererGeneric
{
    render()
    {
        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <Form
                    map={this.props.map}
                    isFragment
                    borderColor={this.props.borderColor}
                />
            </Container>
        );
    }
}

export default connectField(RendererMap, {
    includeInChain: true,
});
