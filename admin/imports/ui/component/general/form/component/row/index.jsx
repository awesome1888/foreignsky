import React from 'react';

import RendererString from './../../component/renderer/string/index.jsx';
import RendererBoolean from './../../component/renderer/boolean/index.jsx';

export default class Row extends React.Component
{
    resolveRenderer(attribute)
    {
        if (attribute.renderer)
        {
            return attribute.renderer;
        }

        const type = attribute.type;

        if (type === String)
        {
            return RendererString;
        }
        if (type === Date)
        {
            return null; //RendererDate;
        }
        if (type === Boolean)
        {
            return RendererBoolean;
        }

        // todo: standard renderers for: object and array of one type

        return null;
    }

    renderRenderer(item, attribute, name)
    {
        const constructor = this.resolveRenderer(attribute);
        if (!constructor) {
            return null;
        }

        return React.createElement(
            constructor,
            {
                name,
                // code: attribute.code,
                // value: item.getAttributeValue(attribute.code),
                // item: item,
                // detailPageUrl: this.props.detailPageUrl,
            }
        );
    }

    getAttribute()
    {
        return this.props.attribute || {};
    }

    render()
    {
        const attribute = this.getAttribute();

        const field = this.props.field; // temporal
        
        // console.dir(attribute);
        
        return (
            <div className="form__row row">
                <div className="form__column col-md-3 col-sm-12">
                    <div className="form__label form__label_padded">
                        {attribute.label}
                    </div>
                </div>
                <div className="form__column col-md-9 col-sm-12">
                    {this.renderRenderer({}, attribute, field)}
                </div>
            </div>
        );
    }
}
