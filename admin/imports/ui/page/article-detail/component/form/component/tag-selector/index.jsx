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

import Popup from '../../../../../../component/general/etc/balloon/index.jsx';
import ColorPicker from '../../../../../../component/general/etc/color-picker/index.jsx';

import colorEnum from '../../../../../../../lib/etc/enum/color.js';

import './style.less';

class RendererTagSelector extends RendererLinkList
{
    _enum = null;
    _selectbox = null;
    _colorPicker = null;
    _scope = null;
    _lastSearchText = '';

    constructor(props)
    {
        super(props);
        this.extendState({
            tagsReady: false,
            colorPopupOpened: false,
            createTagPopupOpened: false,
            currentItemId: null,
        });

        this.onChange = this.onChange.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.closeTagPopup = this.closeTagPopup.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onSearchCancel = this.onSearchCancel.bind(this);
        this.onSearchTypeEnter = this.onSearchTypeEnter.bind(this);
        this.onCreateTagClick = this.onCreateTagClick.bind(this);
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

    onSearch(text, items)
    {
        if (_.isStringNotEmpty(text) && this.dontHaveTagLike(text))
        {
            this._lastSearchText = text;
            this.openCreateTagPopup();
        }
        else
        {
            this.closeCreateTagPopup();
        }
    }

    onSearchCancel()
    {
        this.closeCreateTagPopup();
    }

    onSearchTypeEnter(e)
    {
        this.createTag(true);
        e.preventDefault();
    }
    
    onCreateTagClick()
    {
        this.createTag();
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

    openCreateTagPopup()
    {
        this.setState({
            createTagPopupOpened: true,
        });
    }

    closeCreateTagPopup()
    {
        this._lastSearchText = '';
        this.setState({
            createTagPopupOpened: false,
        });
    }

    createTag(bringFocus = false)
    {
        const text = this._lastSearchText;
        if (_.isStringNotEmpty(text))
        {
            const data = {
                title: text,
                color: colorEnum.getRandomItem().keyLess,
            };

            this.getEntity().save(null, data).then((id) => {
                if (_.isStringNotEmpty(id))
                {
                    // close
                    if (!bringFocus)
                    {
                        this._selectbox.closeDropDown();
                    }
                    else
                    {
                        this._selectbox.startSearch(true);
                    }

                    // instead of calling the db, we complete the existing data:

                    // add new item to the cache
                    data._id = id;
                    this._cache.items[id] = data;

                    // add new item to the enum
                    this.getEnum().add({
                        key: id,
                        value: `#${text}`,
                        color: data.color,
                    });

                    // update value
                    const newValue = _.union(this.getValue(), [id]);
                    this.onChange(newValue);
                }
            });
        }
    }

    dontHaveTagLike(text)
    {
        text = `#${text.toLowerCase().trim()}`;
        return !this.getEnum().find((tag) => {
            return tag.value.toLowerCase().trim() === text;
        });
    }

    async startTagReload()
    {
        this.setState({
            tagsReady: false,
        });

        this.getEntity().find({select: ['title', 'color']}).then((tags) => {
            this.createEnum(tags);
            this.setState({
                tagsReady: true,
            });
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
                                className="icon-label_mode-edit no-decoration"
                                target="_blank"
                            >
                                Edit tag
                            </a>
                        </div>
                    </Popup>
                }
            </div>
        );
    }

    renderCreateButton()
    {
        if (!this.state.createTagPopupOpened)
        {
            return null;
        }

        return (
            <Popup
                opened={true}
                globalClickClose={false}
                className="stratosphere"
            >
                <div className="tag-selector__create-tag">
                    <div
                        className="icon-label_add hand"
                        onClick={this.onCreateTagClick}
                    >
                        Create new tag
                    </div>
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
                            onSearch={this.onSearch}
                            onSearchCancel={this.onSearchCancel}
                            onSearchTypeEnter={this.onSearchTypeEnter}
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
