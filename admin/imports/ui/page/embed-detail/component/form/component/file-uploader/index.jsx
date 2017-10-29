import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import {ControllerClass as RendererLink} from '../../../../../../component/general/form/component/renderer/link/index.jsx';
import Container from '../../../../../../component/general/form/component/renderer/container/index.jsx';
// import Util from '../../../../../../../lib/util.js';
import FilePicker from '../../../../../../component/general/etc/file-picker/index.jsx';

import './style.less';

class RendererFileUploader extends RendererLink
{
    constructor(props)
    {
        super(props);
        this.extendState({
        });
    }

    render()
    {
        if (this.hasError())
        {
            return (
                <div className="form__error">
                    {this.getErrorText()}
                </div>
            );
        }

        console.dir(this.props);

        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                {
                    this.isReady()
                    &&
                    <div
                        ref={(ref) => {this._scope = ref;}}
                    >
                        <FilePicker />
                    </div>
                }
            </Container>
        );
    }
}

export default connectField(RendererFileUploader, {});
