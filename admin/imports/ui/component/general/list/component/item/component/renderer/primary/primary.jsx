import React from 'react';

import RendererGeneric from '../generic/generic.jsx';
// import './style.less';

export default class extends RendererGeneric
{
    render()
    {
        return (
            <div>
                <a href="">{this.prepareValue()}</a><br />
                <span className="text_color_gray">Id: {this.props.item.getId()}</span>
            </div>
        );
    }
}
