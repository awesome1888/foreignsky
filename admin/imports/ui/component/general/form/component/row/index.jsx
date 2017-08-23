import React from 'react';

import RendererString from './../../component/renderer/string/index.jsx';
import RendererBoolean from './../../component/renderer/boolean/index.jsx';
import RendererDate from './../../component/renderer/date/index.jsx';
import RendererList from './../../component/renderer/list/index.jsx';
import RendererLinkList from './../../component/renderer/link-list/index.jsx';
import RenderMap from './../../component/renderer/map/index.jsx';

export default class Row extends React.Component
{
    resolveRenderer()
    {
        const attribute = this.getAttribute();

        const renderer = attribute.getParameter('renderer');
        if (renderer)
        {
            return renderer;
        }

        // special type of String or [String] fields which represent link fields in SimpleSchema
        if (attribute.isReference())
        {
            if (attribute.isArray())
            {
                return RendererLinkList;
            }
        }

        if (attribute.isString() || attribute.isNumber())
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

        if (attribute.isArrayOfLink())
        {
            console.dir('its a link');
            return RendererLinkList;
        }

        if (attribute.isArray())
        {
            return RendererList;
        }

        if (attribute.isMap())
        {
            return RenderMap;
        }

        // todo: can be a single link

        return null;
    }

    resolveItemRenderer()
    {
        const attribute = this.getAttribute();

        const itemRenderer = attribute.getParameter('itemRenderer');
        if (itemRenderer)
        {
            return itemRenderer;
        }

        if (attribute.isArrayOfString() || attribute.isArrayOfNumber())
        {
            return RendererString;
        }
        if (attribute.isArrayOfDate())
        {
            return RendererDate;
        }
        if (attribute.isArrayOfBoolean())
        {
            return RendererBoolean;
        }
        if (attribute.isArrayOfMap())
        {
            return RenderMap;
        }

        return null;
    }

    getControlParams(attribute)
    {
        const params = {
            attribute,
        };

        if (attribute.isArray())
        {
            params.initialCount = attribute.hasMinCount() ? attribute.getMinCount() : 1;
        }
        if (attribute.isMap())
        {
            params.map = attribute.getType();
        }

        return params;
    }

    getControlChildrenParams(attribute)
    {
        const params = {};

        if (attribute.isArrayOfMap())
        {
            params.map = attribute.getType()[0];
        }

        return params;
    }

    getControlChildren(attribute)
    {
        let children = null;
        if (attribute.isArray())
        {
            const renderer = this.resolveItemRenderer();
            if (!renderer)
            {
                return children;
            }

            children = [
                React.createElement(
                    renderer,
                    Object.assign(
                        this.getControlChildrenParams(attribute),
                        {
                            name: '$',
                            key: '-1',
                        }
                    )
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
        return attr.getTitle();
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
