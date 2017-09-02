import React, {Children} from 'react';
import connectField from 'uniforms/connectField';
import joinName from 'uniforms/joinName';
import filterDOMProps from 'uniforms/filterDOMProps';

import { Button } from 'semantic-ui-react';

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

    getName()
    {
        // fixing strange bug with name nesting...
        // todo: solve it normally
        let name = super.getName().split('.');
        return name[name.length - 1];
    }

    makeChildName(child = null, index = false)
    {
        let childName = this.getChildName();
        // if (child && _.isStringNotEmpty(child.props.name))
        // {
        //     childName = child.props.name;
        // }

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

    pickColor()
    {
        if (!this._cache.color)
        {
            this._cache.color = _.sample([
                'red',
                'blue',
                'green',
            ]);
        }

        return this._cache.color;
    }

    renderAddButton()
    {
        return (
            <div className="padding-t">
                <Button
                    onClick={this.onItemAddClick}
                    size="mini"
                    color="green"
                    type="button"
                >
                    New item
                </Button>
            </div>
        );
    }

    renderDeleteButton(index)
    {
        return (
            <Button
                onClick={Util.passCtx(this.onItemDeleteClick, [index])}
                size="mini"
                color="red"
                type="button"
                className="no-margin"
            >
                Delete
            </Button>
        );
    }

    render()
    {
        const children = this.getItemControl();

        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <div className="form__list">
                    <div className="form__list-items">
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
                                                        borderColor: this.pickColor(),
                                                    })
                                                }
                                            </div>
                                            <div className="form__list-item-buttons">
                                                {this.renderDeleteButton(index)}
                                            </div>
                                        </div>
                                    );
                                })
                            })
                        }
                    </div>
                    <div>
                        {this.renderAddButton()}
                    </div>
                </div>
            </Container>
        );
    }
}

export default connectField(RendererList, {
    includeInChain: false,
});
