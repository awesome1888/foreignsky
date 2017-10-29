import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import {ControllerClass as RendererLinkList} from '../../../../../../component/general/form/component/renderer/link-list/index.jsx';
import Container from '../../../../../../component/general/form/component/renderer/container/index.jsx';
import FilePicker from '../../../../../../component/general/etc/file-picker/index.jsx';

import './style.less';

class RendererFileUploader extends RendererLinkList
{
    constructor(props)
    {
        super(props);
        this.extendState({
        });
    }

    onChange(ids)
    {
        this.getOnChange()(ids);
        this.startDataReload(true);
    }

    getItemSelectFields()
    {
        return ['name', 'url', 'size', 'type'];
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
                        <FilePicker
                            files={this.getValueActual()}
                            value={this.getValue()}
                            onChange={this.onChange.bind(this)}
                        />
                    </div>
                }
            </Container>
        );
    }
}

export default connectField(RendererFileUploader, {});
