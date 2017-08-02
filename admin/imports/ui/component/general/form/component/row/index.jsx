import React from 'react';

import RendererString from './../../component/renderer/string/index.jsx';

export default class Row extends React.Component
{
    resolveControl(attribute)
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
            return null; //RendererBoolean;
        }

        // todo: standard renderers for: object and array of one type

        return null;
    }

    getAttribute()
    {
        return this.props.attribute || {};
    }

    render()
    {
        const attribute = this.getAttribute();

        const field = this.props.field; // temporal
        
        console.dir(attribute);
        
        return (
            <div className="form__row row">
                <div className="form__column col-md-3 col-sm-12">
                    <div className="form__label form__label_padded">
                        {attribute.label}
                    </div>
                </div>
                <div className="form__column col-md-9 col-sm-12">
                    <RendererString name={field} />
                </div>
            </div>
        );
    }
}
