import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import {ControllerClass as RendererLinkList} from '../../../../../../component/general/form/component/renderer/link-list/index.jsx';
import Container from '../../../../../../component/general/form/component/renderer/container/index.jsx';
import SelectBox from '../../../../../../component/general/etc/selectbox/index.jsx';
import Enum from '../../../../../../../lib/base/enum/index.js';

import Popup from '../../../../../../component/general/etc/popup/index.jsx';
import ColorPicker from '../../../../../../component/general/etc/color-picker/index.jsx';

import './style.less';

class RendererTagSelector extends RendererLinkList
{
    _enum = null;
    _selectbox = null;
    _colorPicker = null;
    _scope = null;

    constructor(props)
    {
        super(props);
        this.extendState({
            tagsReady: false,
            colorPopupOpened: false,
            currentItemId: null,
        });

        this.onChange = this.onChange.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.closeTagPopup = this.closeTagPopup.bind(this);
    }

    componentDidMount()
    {
        this.startTagReload();
        super.componentDidMount();
    }

    onColorClick(colorCode, color)
    {
        if (this.state.currentItemId)
        {
            // update tag color
            this.getEntity().save(this.state.currentItemId, {color: color.keyLess}).then((res) => {
                // just updating the tag locally, no need to re-fetch it from the db
                this.getEnum().getItemByKey(this.state.currentItemId).color = color.keyLess;

                // force to re-render
                this.setState({
                    tagsReady: true,
                });

                this.closeTagPopup();
            });
        }
    }

    onItemClick(key, p)
    {
        console.dir('click item');
        
        if (this._colorPicker && this._scope)
        {
            this.setState({
                currentItemId: key,
            });

            const itemNode = $(`.selectbox__item-id-${key}`, this._scope).get(0);
            if (itemNode) {
                itemNode.appendChild(this._colorPicker);
                this.openTagPopup();
            }
        }

        p.stopPropagation();
        this._selectbox.closeDropDown();
    }

    openTagPopup()
    {
        if (!this.state.colorPopupOpened)
        {
            this.setState({
                colorPopupOpened: true,
            });
        }
    }

    closeTagPopup()
    {
        if (this.state.colorPopupOpened)
        {
            this.setState({
                colorPopupOpened: false,
            });
        }
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
            <div
                ref={(ref) => {this._colorPicker = ref;}}
            >
                {
                    this.state.colorPopupOpened
                    &&
                    <Popup
                        position="top"
                        opened={true}
                        onClose={this.closeTagPopup}
                        closeStopSelector=".selectbox__item-selected"
                    >
                        <ColorPicker
                            onColorClick={this.onColorClick.bind(this)}
                        />
                        <div className="border-t padding-t_x0p5 margin-t_x0p5">
                            <a
                                href={`/entity/article.tag/${this.state.currentItemId}/`}
                                className="no-decoration"
                                target="_blank"
                            >Edit tag</a>
                        </div>
                    </Popup>
                }
            </div>
        );
    }

    renderCreateButton()
    {
        return (
            <Popup
                opened={true}
                globalClickClose={false}
            >
                <div className="tag-selector__create-tag">
                    <a href="">Create new tag</a>
                </div>
            </Popup>
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
                    <div
                        ref={(ref) => {this._scope = ref;}}
                    >
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
