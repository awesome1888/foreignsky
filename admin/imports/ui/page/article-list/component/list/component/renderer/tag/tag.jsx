import React from 'react';

import RendererGeneric from '../../../../../../../component/general/list/component/row/component/renderer/generic/generic.jsx';
// import './style.less';

export default class extends RendererGeneric
{
    prepareValue()
    {
        let value = this.props.value;
        if (!_.isArray(value))
        {
            value = [];
        }

        return value;
    }

    render()
    {
        return (
            <div>
                TAGS!
                {this.prepareValue()}
            </div>
        );
    }
}
