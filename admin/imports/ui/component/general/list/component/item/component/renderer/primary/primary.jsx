import React from 'react';

import RendererGeneric from '../generic/generic.jsx';
// import './style.less';

export default class PrimaryFieldRenderer extends RendererGeneric
{
    getItemId()
    {
        return this.props.item.getId();
    }

    render()
    {
        const path = '/entity/article/#ID#';
        // todo: get path template from settings
        return (
            <div>
                <a href={path.replace('#ID#', this.getItemId())}>{this.prepareValue()}</a><br />
                <span className="text_color_gray">Id: {this.getItemId()}</span>
            </div>
        );
    }
}
