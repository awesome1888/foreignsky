import React from 'react';
import BaseComponent from '../../../../../../lib/base/component/component.jsx';
import PropTypes from 'prop-types';

// renderers
import RendererGeneric from './component/renderer/generic/generic.jsx';
import RendererDate from './component/renderer/date/date.jsx';
import RendererBoolean from './component/renderer/boolean/boolean.jsx';
import RendererPrimary from './component/renderer/primary/primary.jsx';

export default class ListItem extends BaseComponent
{
    static propTypes = {
        className: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object,
        ]),
        entity: PropTypes.func.isRequired,
        data: PropTypes.object,
        map: PropTypes.array.isRequired,
        onListUpdate: PropTypes.func,
    };

    static defaultProps = {
        className: '',
        entity: null,
        data: {},
        map: [],
        onListUpdate: null,
    };

    resolveRenderer(attribute)
    {
        if (attribute.renderer)
        {
            return attribute.renderer;
        }

        // todo: hardcoded for now, get from the map later
        if (attribute.code === 'title')
        {
            return RendererPrimary;
        }

        const type = attribute.type;

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

    renderRenderer(item, attribute)
    {
        return React.createElement(
            this.resolveRenderer(attribute),
            {
                code: attribute.code,
                value: item.getAttributeValue(attribute.code),
                item: item,
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
                            <td key={attribute.code}>
                                {this.renderRenderer(item, attribute)}
                            </td>
                        );
                    })
                }
            </tr>
        );
    }
}
