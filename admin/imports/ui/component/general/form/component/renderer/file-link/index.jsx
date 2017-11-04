import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import {ControllerClass as RendererLink} from '../link/index.jsx';
import Container from '../container/index.jsx';
// import Util from '../../../../../../../lib/util.js';
import FilePicker from '../../../../etc/file-picker/index.jsx';

import './style.less';

class RendererFileUploader extends RendererLink
{
    constructor(props)
    {
        super(props);
        this.extendState({
        });
    }

    onChange(ids)
    {
        const id = _.isArrayNotEmpty(ids) ? ids[0] : '';
        this.getOnChange()(id);
        if (id)
        {
            this.startDataReload(true);
        }
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
                            files={this.getValueActual() ? [this.getValueActual()] : []}
                            value={_.isStringNotEmpty(this.getValue()) ? [this.getValue()] : []}
                            onChange={this.onChange.bind(this)}
                            max={1}
                        />
                    </div>
                }
            </Container>
        );
    }
}

export default connectField(RendererFileUploader, {});
