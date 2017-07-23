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
    };

    static defaultProps = {
        className: '',
        entity: null,
    };

    render() {
        if (!_.isObject(this.props.data)) {
            return;
        }

        return (
            <div className="data-block-panel">
                <div className="data-block__content data-block__content_adaptive">
                    {
                        _.map(this.props.data, (item, key) => {
                            if (_.isObject(item) || _.isArray(item)) {
                                return null;
                            }

                            return (
                                <div className="" key={key}>
                                    {key}: {item}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}
