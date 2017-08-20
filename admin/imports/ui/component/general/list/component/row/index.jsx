import React from 'react';
import BaseComponent from '../../../../../../lib/base/component/component.jsx';
import PropTypes from 'prop-types';

// renderers
import RendererGeneric from './component/renderer/generic/generic.jsx';
import RendererDate from './component/renderer/date/date.jsx';
import RendererBoolean from './component/renderer/boolean/boolean.jsx';
import RendererPrimary from './component/renderer/primary/primary.jsx';

export default class Row extends BaseComponent
{
    static propTypes = {
        className: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object,
        ]),
        entity: PropTypes.func.isRequired,
        data: PropTypes.object,
        map: PropTypes.object.isRequired,
        onListUpdate: PropTypes.func,
        detailPageUrl: PropTypes.string,
    };

    static defaultProps = {
        className: '',
        entity: null,
        data: {},
        map: [],
        onListUpdate: null,
        detailPageUrl: '',
    };

    resolveRenderer(attribute)
    {
        const renderer = attribute.getParameter('renderer');
        if (renderer)
        {
            return renderer;
        }

        if (attribute.isPrimary())
        {
            return RendererPrimary;
        }

        const type = attribute.getType();

        if (type === String)
        {
            return RendererGeneric;
        }
        if (type === Date)
        {
            return RendererDate;
        }
        if (type === Boolean)
        {
            return RendererBoolean;
        }

        // todo: standard renderers for: object and array of one type

        return RendererGeneric;
    }

    renderControl(item, attribute)
    {
        return React.createElement(
            this.resolveRenderer(attribute),
            {
                code: attribute.getCode(),
                value: item.getAttributeValue(attribute.getCode()),
                item: item,
                detailPageUrl: this.props.detailPageUrl,
            }
        );
    }

    render() {
        if (!_.isObject(this.props.data)) {
            return;
        }

        const item = this.props.data;
        
        return (
            <tr
                key={item.getId()}
            >
                {
                    this.props.map.map((attribute) => {
                        if (!_.isObject(attribute)) {
                            return null;
                        }

                        return (
                            <td key={attribute.getCode()}>
                                {this.renderControl(item, attribute)}
                            </td>
                        );
                    })
                }
            </tr>
        );
    }
}
