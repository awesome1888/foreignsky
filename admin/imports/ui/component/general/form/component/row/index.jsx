import React from 'react';

import RendererString from './../../component/renderer/string/index.jsx';
import RendererBoolean from './../../component/renderer/boolean/index.jsx';
import RendererDate from './../../component/renderer/date/index.jsx';
import RendererList from './../../component/renderer/list/index.jsx';
import RenderSchema from './../../component/renderer/schema/index.jsx';

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

        if (attribute.isArrayOfStringDiscreet())
        {
            // todo: it should be rendered as selectbox with
            // todo: either checkboxes or radio-buttons, depending on what we have in maxCount
            return null;
        }

        if (attribute.isArray())
        {
            return RendererList;
        }

        if (attribute.isSchema())
        {
            return RenderSchema;
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

    getControlParams(attribute)
    {
        const params = {
            attribute,
        };

        if (attribute.isArray()) {
            params.initialCount = 1;
            // params.map = new Map();
        }

        return params;
    }

    getControlChildren(attribute)
    {
        let children = null;
        if (attribute.isArray())
        {
            children = [
                React.createElement(
                    this.resolveItemRenderer(),
                    {
                        name: '$',
                        key: '-1',
                    }
                )
            ];
        }

        return children;
    }

    renderControl()
    {
        const attribute = this.getAttribute();

        const constructor = this.resolveRenderer();
        if (!constructor) {
            return null;
        }

        return React.createElement(
            constructor,
            Object.assign(
                this.getControlParams(attribute),
                {
                    name: attribute.getCode(),
                }
            ),
            this.getControlChildren(attribute)
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
