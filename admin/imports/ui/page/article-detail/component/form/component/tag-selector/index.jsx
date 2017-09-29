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
    _selectbox = null;

    constructor(props)
    {
        super(props);
        this.extendState({
            tagsReady: false,
        });

        this.onChange = this.onChange.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
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

    onItemClick(key, p, e)
    {
        console.dir('click');
        console.dir(key);

        p.stopPropagation();
        this._selectbox.closeDropDown();
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

    renderColorPicker()
    {
        return (
            <div className="popup popup_top">
                <div className="popup__inner">
                    <div className="popup__content">
                        <div className="tag-selector__create-tag">
                            I am a color picker
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderCreateButton()
    {
        return (
            <div className="popup">
                <div className="popup__inner">
                    <div className="popup__content">
                        <div className="tag-selector__create-tag">
                            <a href="">Create new tag</a>
                        </div>
                    </div>
                </div>
            </div>
        );
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
                    <div className="">
                        <SelectBox
                            value={this.getValue()}
                            items={this.getEnum()}
                            multiple
                            onChange={this.onChange}
                            onItemClick={this.onItemClick}
                            itemSelectedClassName="round hand"
                            ref={(ref) => {this._selectbox = ref;}}
                            afterInputContainer={
                                this.renderCreateButton()
                            }
                        />

                        {this.renderColorPicker()}
                    </div>
                }
            </Container>
        );
    }
}

export default connectField(RendererTagSelector, {});
