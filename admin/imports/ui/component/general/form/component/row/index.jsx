import React from 'react';

import RendererString from './../../component/renderer/string/index.jsx';
import RendererBoolean from './../../component/renderer/boolean/index.jsx';
import RendererDate from './../../component/renderer/date/index.jsx';
import RendererList from './../../component/renderer/list/index.jsx';

export default class Row extends React.Component
{
    resolveRenderer()
    {
        const attribute = this.getAttribute();

        if (attribute.getRenderer())
        {
            return attribute.getRenderer();
        }

        if (attribute.isString())
        {
            return RendererString;
        }
        if (attribute.isDate())
        {
            return RendererDate;
        }
        if (attribute.isBoolean())
        {
            return RendererBoolean;
        }

        if (attribute.isArrayOfBoolean())
        {
            // todo: it should be rendered as selectbox with
            // todo: either checkboxes or radio-buttons
            return null;
        }

        if (attribute.isArray())
        {
            return RendererList;
        }

        return null;
    }

    resolveItemRenderer()
    {
        const attribute = this.getAttribute();

        if (attribute.getItemRenderer())
        {
            return attribute.getItemRenderer();
        }

        if (attribute.isStringItem() || attribute.isNumberItem())
        {
            return RendererString;
        }
        if (attribute.isDateItem())
        {
            return RendererDate;
        }
        if (attribute.isBooleanItem())
        {
            return RendererBoolean;
        }
        
        // todo: could be also sub-schema

        return null;
    }

    renderControl()
    {
        const attribute = this.getAttribute();

        const constructor = this.resolveRenderer();
        if (!constructor) {
            return null;
        }

        let children = null;
        if (attribute.isArray())
        {
            children = [this.resolveItemRenderer()];
        }

        return React.createElement(
            constructor,
            {
                name: attribute.getCode(),
                attribute,
                // value: item.getAttributeValue(attribute.code),
                // detailPageUrl: this.props.detailPageUrl,
            },
            children
        );
    }

    getAttribute()
    {
        return this.props.attribute || {};
    }

    renderLabel()
    {
        const attr = this.getAttribute();
        return attr.getLabel() || attr.getCode() || '';
    }

    render()
    {
        const a = this.getAttribute();

        return (
            <div className="form__row row">
                <div className="form__column col-md-3 col-sm-12">
                    {
                        !a.isBoolean()
                        &&
                        <div className="form__label form__label_padded">
                            {this.renderLabel()}:
                        </div>
                    }
                </div>
                <div className="form__column col-md-9 col-sm-12">
                    {this.renderControl(a)}
                </div>
            </div>
        );
    }
}
