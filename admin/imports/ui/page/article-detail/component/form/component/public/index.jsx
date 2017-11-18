import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import Container from '../../../../../../component/general/form/component/renderer/container/index.jsx';
import {ControllerClass as RendererBoolean} from '../../../../../../component/general/form/component/renderer/boolean/index.jsx';

class RendererPublic extends RendererBoolean
{
    render()
    {
        const item = this.getForm().getItem();

        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <div className="content_row group_x2">
                    <div className="">
                        {
                            this.hasLabel()
                            &&
                            <label>
                                {this.renderInput()}
                                {this.getLabel()}
                            </label>
                        }
                        {
                            !this.hasLabel()
                            &&
                            this.renderInput()
                        }
                    </div>
                    {
                        // todo: get the url from options
                        !!item
                        &&
                        <a
                            className="icon-label_desktop-windows no-decoration"
                            href={`http://localhost:3001/${item.getId()}?token=${this.getForm().getToken()}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            View article
                        </a>
                    }
                </div>
            </Container>
        );
    }
}

export default connectField(RendererPublic, {});
