import React from 'react';
import BaseComponent from '../../../../../../lib/base/component/component.jsx';
import PropTypes from 'prop-types';

// renderers
import RendererGeneric from './component/renderer/generic/generic.jsx';
import RendererDate from './component/renderer/date/date.jsx';

export default class ListItem extends BaseComponent {

    static propTypes = {
        className: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object,
        ]),
        entity: PropTypes.func.isRequired,
        data: PropTypes.object,
        map: PropTypes.array.isRequired,
    };

    static defaultProps = {
        className: '',
        entity: null,
        data: [],
        map: [],
    };

    resolveRenderer(type)
    {
        if (type === String)
        {
            return RendererGeneric;
        }
        if (type === Date)
        {
            return RendererDate;
        }

        return RendererGeneric;
    }

    renderRenderer(item, attribute)
    {
        return React.createElement(
            this.resolveRenderer(attribute.type),
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
            <tr>
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
