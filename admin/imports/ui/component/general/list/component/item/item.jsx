import React from 'react';
import BaseComponent from '../../../../../../lib/base/component/component.jsx';
import PropTypes from 'prop-types';

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
                            <td key={item.code}>
                                {item[attribute.code]}
                            </td>
                        );
                    })
                }
            </tr>
        );
    }
}
