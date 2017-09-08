import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
// import Util from '../../../../../../../lib/util.js';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';

import './style.less';

class RendererSelectBox extends RendererGeneric
{
    _dropdown = null;
    _scope = null;

    constructor(props)
    {
        super(props);
        this.extendState({
            opened: false,
        });

        this.onDropDownScroll = this.onDropDownScroll.bind(this);
    }

    onDropDownScroll(e)
    {
        // blocking scroll up
        if (e.deltaY < 0 && this._dropdown.scrollTop <= 0)
        {
            e.preventDefault();
        }

        // blocking scroll down
        if(e.deltaY > 0)
        {
            if (this._dropdown.scrollTop + this.getHeght(this._dropdown) >= this.getHeght(this._scope))
            {
                e.preventDefault();
            }
        }
    }

    getHeght(el)
    {
        return el.getBoundingClientRect().height;
    }

    getEnum()
    {
        return this.getAttribute().getAllowedValues();
    }

    isMultiple()
    {
        return this.getAttribute().isArray();
    }

    getUnifiedValue()
    {
        const actualValue = this.getValue();

        if (this.isMultiple() && _.isArrayNotEmpty(actualValue))
        {
            return actualValue.filter(x => !!x);
        }
        if (!this.isMultiple() && actualValue)
        {
            return [actualValue];
        }

        return [];
    }

    getItems(search = '')
    {
        return this.getEnum().selectize(search);
    }

    render()
    {
        const value = this.getUnifiedValue();
        
        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <div className="selectbox">
                    <div className="selectbox__container">
                        <div className="selectbox__container-inner">
                            {
                                value.map((item) => {
                                    return (
                                        <div className="selectbox__item-selected selectbox__item-selected_closeable" key={item}>
                                            {this.getEnum().getValue(item)}
                                            <input
                                                value={item}
                                                name={this.getName()}
                                                type="hidden"
                                            />
                                            <div className="selectbox__item-selected-close">
                                                <div className="selectbox__item-selected-close-icon" />
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            <input type="text" className="selectbox__input" />
                        </div>
                        <div
                            className="selectbox__dropdown"
                            ref={ ref => {this._dropdown = ref; }}
                            onWheel={this.onDropDownScroll}
                        >
                            <div
                                className="selectbox__dropdown-scope"
                                ref={ ref => {this._scope = ref; }}
                            >
                                {
                                    this.getItems().map((item) => {
                                        return (
                                            <label className="selectbox__dropdown-item" key={item.value+item.label}>
                                                <input type="checkbox" className="selectbox__dropdown-item-checkbox" />
                                                <div className="selectbox__dropdown-item-text">
                                                    {item.label}
                                                </div>
                                            </label>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </Container>
        );
    }
}

export default connectField(RendererSelectBox, {});
