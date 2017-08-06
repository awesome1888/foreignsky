import React, {Children} from 'react';
import connectField from 'uniforms/connectField';
import joinName from 'uniforms/joinName';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';

class RendererList extends RendererGeneric
{
    getItemControl()
    {
        if (this.children)
        {
            return this.children;
        }

        return;
    }

    getChildName(child, index)
    {
        if (_.isStringNotEmpty(child.props.name))
        {
           return joinName(this.getName(), child.props.name.replace('$', index));
        }

        return `${this.getName()}.${index}`;
    }

    render()
    {
        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <div>
                    {
                        this.getValue().map((item, index) =>
                            Children.map(this.getItemControl(), child =>
                                React.cloneElement(child, {
                                    key: index,
                                    label: null,
                                    name: this.getChildName(child, index),
                                })
                            )
                        )
                    }
                </div>
            </Container>
        );
    }
}

export default connectField(RendererList, {});
