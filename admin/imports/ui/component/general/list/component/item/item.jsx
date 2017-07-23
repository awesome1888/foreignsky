import React, {Component} from 'react';

export default class ListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

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
