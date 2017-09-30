import React from 'react';

import BaseComponent from '../../../../../lib/base/component/component.jsx';
import ScrollPane from '../scroll-pane/index.jsx';
import colorEnum from '../../../../../lib/etc/enum/color.js';

import './style.less';
import PropTypes from 'prop-types';

export default class ColorPicker extends BaseComponent
{
    static propTypes = {
        onColorClick: PropTypes.func,
        // onColorMouseOver: PropTypes.func,
        // onColorMouseOut: PropTypes.func,
    };

    static defaultProps = {
        onColorClick: null,
        // onColorMouseOver: null,
        // onColorMouseOut: null,
    };

    constructor(props)
    {
        super(props);
        this.extendState({
        });
    }

    onItemClick(key)
    {
        if (_.isFunction(this.props.onColorClick))
        {
            this.props.onColorClick(key, colorEnum.getItemByKey(key));
        }
    }

    render()
    {
        return (
            <ScrollPane
                className="color-picker"
                innerClassName="color-picker__palette"
            >
                {colorEnum.map((item) => {
                    return (
                        <div
                            className="color-picker__sample"
                            title={item.value}
                            onClick={this.onItemClick.bind(this, item.key)}
                        >
                            <div className={`color-picker__sample-inner b-color_${item.keyLess}`} />
                        </div>
                    );
                })}
            </ScrollPane>
        );
    }
}
