import React from 'react';
import PropTypes from 'prop-types';

import BaseComponent from '../../../../../../../../../lib/base/component/component.jsx';
// import './style.less';

export default class GenericRenderer extends BaseComponent
{
    static propTypes = {
        code: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.bool,
            PropTypes.object,
            PropTypes.array,
        ]).isRequired,
        item: PropTypes.object,
        onUpdate: PropTypes.func,
    };

    static defaultProps = {
        code: '',
        value: '',
        item: null,
        onUpdate: () => {},
    };

    // constructor(params) {
    //     super(params);
    //     Object.assign(this.state, {});
    // }

    prepareValue()
    {
        let value = this.props.value;
        if (value === null || value === undefined)
        {
            value = '';
        }

        return value;
    }

    render()
    {
        return (
            <div>
                {this.prepareValue().toString()}
            </div>
        );
    }
}
