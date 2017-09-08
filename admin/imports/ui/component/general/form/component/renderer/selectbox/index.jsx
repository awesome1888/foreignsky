import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import Util from '../../../../../../../lib/util.js';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';

import './style.less';

class RendererSelectBox extends RendererGeneric
{
    _dropdown = null;
    _bounds = null;
    _search = null;
    _scope = null;

    constructor(props)
    {
        super(props);
        this.extendState({
            opened: false,
            items: [],
        });

        this.onDropDownScroll = this.onDropDownScroll.bind(this);
        this.onItemRemoveClick = this.onItemRemoveClick.bind(this);
        this.onContainerClick = this.onContainerClick.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onSearchKeyDown = this.onSearchKeyDown.bind(this);
        this.onSearchKeyUp = _.debounce(this.onSearchKeyUp.bind(this), 300);

        $(window.document).on('click', this.onDocumentClick);
    }

    componentWillUnmount()
    {
        $(window.document).off('click', this.onDocumentClick);
    }

    onDropDownScroll(e)
    {
        // blocking scroll up
        if (e.deltaY < 0 && this._dropdown.scrollTop <= 0)
        {
            e.preventDefault();
        }

        // blocking scroll down
        if(e.deltaY > 0)
        {
            if (this._dropdown.scrollTop + this.getHeight(this._dropdown) >= this.getHeight(this._bounds))
            {
                e.preventDefault();
            }
        }
    }

    onDocumentClick(e)
    {
        let node = e.target;
        while(node)
        {
            if (node === this._scope)
            {
                return;
            }

            node = node.parentElement;
        }

        this.closeDropDown();
    }

    onContainerClick()
    {
        this.openDropDown(() => {
            this.focusSearch();
        });
    }

    getOnChange()
    {
        if (_.isFunction(this.props.onChange))
        {
            return this.props.onChange;
        }

        return e => e;
    }

    onSearchKeyDown(e)
    {
        if (e.key === 'Backspace' && this._search.value === '')
        {
            // remove last item
            const newVal = _.clone(this.getValue());
            newVal.pop();
            this.onChange(newVal);
        }
    }

    onSearchKeyUp(e)
    {
        const search = this._search.value;
        this.setState({
            items: this.getItems(search),
        });
    }

    getHeight(el)
    {
        return el.getBoundingClientRect().height;
    }

    getEnum()
    {
        return this.getAttribute().getAllowedValues();
    }

    isMultiple()
    {
        return this.getAttribute().isArray();
    }

    getUnifiedValue()
    {
        const actualValue = this.getValue();

        if (this.isMultiple() && _.isArrayNotEmpty(actualValue))
        {
            return actualValue.filter(x => !!x);
        }
        if (!this.isMultiple() && actualValue)
        {
            return [actualValue];
        }

        return [];
    }

    getItems(search = '')
    {
        return this.getEnum().selectize(search);
    }

    isOpened()
    {
        return this.state.opened;
    }

    openDropDown(cb, search = '')
    {
        if (!this.state.opened)
        {
            this.setState({
                opened: true,
                items: this.getItems(search),
            }, cb);
        }
        else
        {
            cb();
        }
    }

    closeDropDown()
    {
        if (this.state.opened)
        {
            this.setState({
                opened: false,
            });
        }
    }

    focusSearch()
    {
        if (this._search)
        {
            this._search.focus();
        }
    }

    isItemSelected(item)
    {
        // todo: improve this, indexOf is slow
        return this.getValue().indexOf(item) >= 0;
    }

    onItemRemoveClick(item, e)
    {
        this.onChange(_.difference(this.getValue(), [item]));
        // to prevent the conflict with .onContainerClick()
        e.stopPropagation();
    }

    onItemToggleChange(item)
    {
        if (this.isItemSelected(item))
        {
            this.onChange(_.difference(this.getValue(), [item]));
        }
        else
        {
            this.onChange(_.union(this.getValue(), [item]));
        }

        this.focusSearch();
    }

    render()
    {
        const value = this.getUnifiedValue();
        
        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <div
                    className="selectbox"
                    ref={ ref => {this._scope = ref; }}
                >
                    <div className="selectbox__container">
                        <div
                            className="selectbox__container-inner"
                            onClick={this.onContainerClick}
                        >
                            {
                                value.map((item) => {
                                    return (
                                        <div className="selectbox__item-selected selectbox__item-selected_removable" key={item}>
                                            {this.getEnum().getValue(item)}
                                            <input
                                                value={item}
                                                name={this.getName()}
                                                type="hidden"
                                            />
                                            <div
                                                className="selectbox__item-selected-remove"
                                                onClick={Util.passCtx(this.onItemRemoveClick, [item])}
                                            >
                                                <div className="selectbox__item-selected-remove-icon" />
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            {
                                this.isOpened()
                                &&
                                <input
                                    type="text"
                                    className="selectbox__input"
                                    ref={ ref => {this._search = ref; }}
                                    onKeyDown={this.onSearchKeyDown}
                                    onKeyUp={this.onSearchKeyUp}
                                />
                            }
                        </div>
                        {
                            this.isOpened() && this.state.items.length > 0
                            &&
                            <div
                                className="selectbox__dropdown"
                                ref={ ref => {this._dropdown = ref; }}
                                onWheel={this.onDropDownScroll}
                            >
                                <div
                                    className="selectbox__dropdown-scope"
                                    ref={ ref => {this._bounds = ref; }}
                                >
                                    {
                                        this.state.items.map((item) => {
                                            return (
                                                <label className="selectbox__dropdown-item" key={item.value+item.label}>
                                                    <input
                                                        type="checkbox"
                                                        className="selectbox__dropdown-item-checkbox"
                                                        checked={this.isItemSelected(item.value)}
                                                        onChange={this.onItemToggleChange.bind(this, item.value)}
                                                    />
                                                    <div className="selectbox__dropdown-item-text">
                                                        {item.label}
                                                    </div>
                                                </label>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>

            </Container>
        );
    }
}

export default connectField(RendererSelectBox, {});
