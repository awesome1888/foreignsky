import React, {Children} from 'react';
import connectField from 'uniforms/connectField';
import joinName from 'uniforms/joinName';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';
import Util from '../../../../../../../lib/util.js';
import './style.less';

class RendererList extends RendererGeneric
{
    constructor(props)
    {
        super(props);
        this.onItemAddClick = this.onItemAddClick.bind(this);
        this.onItemDeleteClick = this.onItemDeleteClick.bind(this);
    }

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

        return this.isDisabled() || a.getMaxCount() <= this.getValue().length;
    }

    getInitialCount()
    {
        if ('initialCount' in this.props)
        {
            return this.props.initialCount;
        }

        return 1;
    }

    getOnChange()
    {
        if (_.isFunction(this.props.onChange))
        {
            return this.props.onChange;
        }

        return e => e;
    }

    onItemAddClick()
    {
        const isLimitReached = this.isLimitReached();
        const onChange = this.getOnChange();
        const val = this.getValue();

        if (!isLimitReached)
        {
            onChange(val.concat(['']));
        }
    }

    onItemDeleteClick(index)
    {
        const onChange = this.getOnChange();
        const value = this.getValue();

        onChange([]
            .concat(value.slice(0,  index))
            .concat(value.slice(1 + index)));
    }

    renderAddButton()
    {
        return (
            <button
                type="button"
                onClick={this.onItemAddClick}
            >
                + Add
            </button>
        );
    }

    renderDeleteButton()
    {
        // todo
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
                <div className="form__list">
                    {
                        this.getValue().map((item, index) => {
                            return Children.map(children, child => {

                                return (
                                    <div className="form__list-item">
                                        <div className="form__list-item-container">
                                            {
                                                React.cloneElement(child, {
                                                    key: index,
                                                    label: null,
                                                    name: this.makeChildName(child, index),
                                                })
                                            }
                                        </div>
                                        <div className="form__list-item-buttons">
                                            <button
                                                type="button"
                                                onClick={Util.passCtx(this.onItemDeleteClick, [index])}
                                            >Delete</button>
                                        </div>
                                    </div>
                                );
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
