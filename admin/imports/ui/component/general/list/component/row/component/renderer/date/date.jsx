import React from 'react';
import moment from 'moment';

import RendererGeneric from '../generic/generic.jsx';
// import './style.less';

export default class DateRenderer extends RendererGeneric
{
    prepareValue()
    {
        let value = this.props.value;
        if (value === undefined)
        {
            value = null;
        }

        return value;
    }

    render()
    {
        return (
            <div>
                {moment(this.prepareValue()).format('LL')}
            </div>
        );
    }
}
