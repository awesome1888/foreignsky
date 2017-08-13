import React from 'react';

import RendererGeneric from '../generic/generic.jsx';
// import './style.less';

export default class BooleanRenderer extends RendererGeneric
{
    prepareValue()
    {
        return !!this.props.value;
    }

    render()
    {
        return (
            <div>
                {this.prepareValue() ? 'Yes' : 'No'}
            </div>
        );
    }
}
