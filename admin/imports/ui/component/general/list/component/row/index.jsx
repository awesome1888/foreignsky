import React from 'react';
import BaseComponent from '../../../../../../lib/base/component/component.jsx';
import PropTypes from 'prop-types';

import { Checkbox, Table } from 'semantic-ui-react';

// renderers
import RendererGeneric from './component/renderer/generic/generic.jsx';
import RendererDate from './component/renderer/date/date.jsx';
import RendererBoolean from './component/renderer/boolean/boolean.jsx';
import RendererCutaway from './component/renderer/cutaway/cutaway.jsx';

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
        onSelectorChange: PropTypes.func,
    };

    static defaultProps = {
        className: '',
        entity: null,
        data: {},
        map: [],
        onListUpdate: null,
        detailPageUrl: '',
        onSelectorChange: null,
    };

    constructor(props)
    {
        super(props);
        this.onSelectorChange = this.onSelectorChange.bind(this);
    }

    onSelectorChange()
    {
        const checked = !this._checkbox.state.checked;
        if (_.isFunction(this.props.onSelectorChange))
        {
            this.props.onSelectorChange(checked, this.props.data);
        }
    }

    resolveRenderer(attribute)
    {
        const renderer = attribute.getParameter('renderer');
        if (renderer)
        {
            return renderer;
        }

        if (attribute.isCutaway())
        {
            return RendererCutaway;
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
            <Table.Row key={item.getId()}>
                <Table.Cell collapsing key="checkbox">
                    <Checkbox
                        slider
                        onChange={this.onSelectorChange}
                        ref={ ref => {this._checkbox = ref; }}
                    />
                </Table.Cell>
                {
                    this.props.map.map((attribute) => {
                        if (!_.isObject(attribute)) {
                            return null;
                        }

                        return (
                            <Table.Cell
                                key={attribute.getCode()}
                            >
                                {this.renderControl(item, attribute)}
                            </Table.Cell>
                        );
                    })
                }
            </Table.Row>
        );

        return (
            <tr
                key={item.getId()}
            >

            </tr>
        );
    }
}
