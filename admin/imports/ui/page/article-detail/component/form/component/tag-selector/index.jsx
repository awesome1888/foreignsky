import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import {ControllerClass as RendererLinkList} from '../../../../../../component/general/form/component/renderer/link-list/index.jsx';
import Container from '../../../../../../component/general/form/component/renderer/container/index.jsx';
import SelectBox from '../../../../../../component/general/aux/selectbox/index.jsx';
import Enum from '../../../../../../../lib/base/enum/index.js';

import './style.less';

class RendererTagSelector extends RendererLinkList
{
    _enum = null;

    constructor(props)
    {
        super(props);
        this.extendState({
            tagsReady: false,
        });
    }

    componentDidMount()
    {
        this.startTagReload();
        super.componentDidMount();
    }

    onChange(value)
    {
        console.dir(value);
        super.onChange(value);
    }

    async startTagReload()
    {
        this.setState({
            tagsReady: false,
        });

        this.getEntity().find({select: ['title', 'color']}).then((tags) => {
            this.setState({
                tagsReady: true,
            });
            this.createEnum(tags);
        });
    }

    createEnum(tags)
    {
        const items = [];
        tags.forEach((tag) => {
            items.push({
                value: `#${tag.getTitle().toLowerCase()}`,
                key: tag.getId(),
                color: tag.getColor(),
            });
        });

        this._enum = new Enum(items);
    }

    getEnum()
    {
        return this._enum;
    }

    isReady()
    {
        return this.state.tagsReady && super.isReady();
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
                    <SelectBox
                        value={this.getValue()}
                        items={this.getEnum()}
                        multiple
                        onChange={this.onChange.bind(this)}
                    />
                }
            </Container>
        );
    }
}

export default connectField(RendererTagSelector, {});
