import React from 'react';
import filterDOMProps from 'uniforms/filterDOMProps';

import RendererGeneric from '../generic/index.jsx';

export default class RendererGroup extends RendererGeneric
{
    render()
    {
        console.dir(this.props);

        return (
            <div
            >
                GROUP!
            </div>
        );
    }
}
