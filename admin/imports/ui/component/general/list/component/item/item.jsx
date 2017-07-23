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
    };

    static defaultProps = {
        className: '',
        entity: null,
        data: [],
    };

    render() {
        if (!_.isObject(this.props.data)) {
            return;
        }

        return (
            <tr>
                {
                    this.props.data.map((item) => {
                        if (!_.isObject(item)) {
                            return null;
                        }

                        return (
                            <td key={item.code}>
                                {item.value}
                            </td>
                        );
                    })
                }
            </tr>
        );
    }
}
