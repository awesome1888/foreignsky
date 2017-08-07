import React, {Children} from 'react';
import connectField from 'uniforms/connectField';
import joinName from 'uniforms/joinName';
import filterDOMProps from 'uniforms/filterDOMProps';

import ButtonAdd from './button-add/button-add.jsx';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';

class RendererList extends RendererGeneric
{
    getItemControl()
    {
        if (this.props.children)
        {
            return this.props.children;
        }

        throw new ReferenceError('Unable to get child list element');
    }

    getChildName(child, index)
    {
        if (_.isStringNotEmpty(child.props.name))
        {
           return joinName(this.getName(), child.props.name.replace('$', index));
        }

        return `${this.getName()}.${index}`;
    }

    isLimitReached()
    {
        const a = this.getAttribute();

        return this.isDisabled() || a.getMax() <= this.getValue().length;
    }

    onItemAddClick()
    {
        const isLimitReached = this.isLimitReached();
        const onChange = this.props.onChange;
        const val = this.getValue();

        if (!isLimitReached)
        {
            onChange(val.concat(['']));
        }
    }

    renderAddButton()
    {
        return (
            <ButtonAdd
                name={`${this.getName()}.$`}
                initialCount={this.props.initialCount}
            />
        );
    }

    render()
    {
        console.dir(this.getName());
        console.dir(this.getValue());

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
                    <div>
                        {this.renderAddButton()}
                    </div>
                </div>
            </Container>
        );
    }
}

export default connectField(RendererList, {includeInChain: false});

