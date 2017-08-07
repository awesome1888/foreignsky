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

    getChildName()
    {
        return '$';
    }

    makeChildName(child = null, index = false)
    {
        let childName = this.getChildName();
        if (child && _.isStringNotEmpty(child.props.name))
        {
            childName = child.props.name;
        }

        return joinName(
            this.getName(),
            index !== false ? childName.replace('$', index) : childName
        );
    }

    isLimitReached()
    {
        const a = this.getAttribute();

        return this.isDisabled() || a.getMax() <= this.getValue().length;
    }

    getInitialCount()
    {
        if ('initialCount' in this.props)
        {
            return this.props.initialCount;
        }

        return 1;
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
                name={this.makeChildName()}
                initialCount={this.getInitialCount()}
            />
        );
    }

    render()
    {
        // console.dir(this.getName());
        // console.dir(this.getValue());

        const children = this.getItemControl();

        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <div>
                    {
                        this.getValue().map((item, index) => {
                            return Children.map(children, child => {
                                return React.cloneElement(child, {
                                    key: index,
                                    label: null,
                                    name: this.makeChildName(child, index),
                                });
                            })
                        })
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
