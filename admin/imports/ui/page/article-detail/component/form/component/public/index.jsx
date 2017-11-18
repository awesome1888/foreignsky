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
        console.dir(this.props);

        const form = this.getForm();
        const model = form.getModel();

        console.dir(model);

        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <div className="content_row">
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
                    <div className="">

                    </div>
                </div>
            </Container>
        );
    }
}

export default connectField(RendererPublic, {});
