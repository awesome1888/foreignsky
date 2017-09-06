import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';

import './style.less';

class RendererSelectBox extends RendererGeneric
{
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
                                        <div className="selectbox__item_selected" key={item}>
                                            {this.getEnum().getValue(item)}
                                            <input
                                                value={item}
                                                name={this.getName()}
                                                type="hidden"
                                            />
                                        </div>
                                    );
                                })
                            }
                            <input type="text" className="selectbox__input" />
                        </div>
                    </div>
                </div>

            </Container>
        );
    }
}

export default connectField(RendererSelectBox, {});
