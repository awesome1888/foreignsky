import React from 'react';

import RendererString from './../../component/renderer/string/index.jsx';
import RendererBoolean from './../../component/renderer/boolean/index.jsx';
import RendererDate from './../../component/renderer/date/index.jsx';
import RendererList from './../../component/renderer/list/index.jsx';

export default class Row extends React.Component
{
    resolveRenderer(attribute)
    {
        if (attribute.renderer)
        {
            return attribute.renderer;
        }

        if (this.isString())
        {
            return RendererString;
        }
        if (this.isDate())
        {
            return RendererDate;
        }
        if (this.isBoolean())
        {
            return RendererBoolean;
        }

        if (this.isArrayOfBoolean())
        {
            // todo: it should be rendered as selectbox with
            // todo: either checkboxes or radio-buttons
            return null;
        }

        if (this.isArray())
        {
            return RendererList;
        }

        return null;
    }

    renderControl(attribute)
    {
        const constructor = this.resolveRenderer(attribute);
        if (!constructor) {
            return null;
        }

        return React.createElement(
            constructor,
            {
                name: attribute.code,
                attribute,
                // value: item.getAttributeValue(attribute.code),
                // detailPageUrl: this.props.detailPageUrl,
            }
        );
    }

    getAttribute()
    {
        return this.props.attribute || {};
    }

    // checkers for standard types
    isString()
    {
        return this.getAttribute().type === String;
    }

    isBoolean()
    {
        return this.getAttribute().type === Boolean;
    }

    isDate()
    {
        return this.getAttribute().type === Date;
    }

    isArrayOfBoolean()
    {
        const a = this.getAttribute();
        return a.type === Array && a.type === Boolean;
    }

    isArray()
    {
        return _.isArray(this.getAttribute().type);
    }

    renderLabel()
    {
        const attr = this.getAttribute();
        return attr.label || attr.code || '';
    }

    render()
    {
        const attribute = this.getAttribute();
        // console.dir(attribute);

        return (
            <div className="form__row row">
                <div className="form__column col-md-3 col-sm-12">
                    {
                        !this.isBoolean()
                        &&
                        <div className="form__label form__label_padded">
                            {this.renderLabel()}:
                        </div>
                    }
                </div>
                <div className="form__column col-md-9 col-sm-12">
                    {this.renderControl(attribute)}
                </div>
            </div>
        );
    }
}
