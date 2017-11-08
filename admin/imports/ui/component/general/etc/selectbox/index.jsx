import React from 'react';
import Util from '../../../../../lib/util.js';
import BaseComponent from '../../../../../lib/base/component/component.jsx';
import Enum from '../../../../../lib/base/enum/index.js';

import PropTypes from 'prop-types';

import './style.less';

export default class SelectBox extends BaseComponent
{
    static propTypes = {
        value: PropTypes.array,
        items: PropTypes.oneOfType([
            PropTypes.array, // todo: describe as shape
            PropTypes.instanceOf(Enum),
        ]),
        name: PropTypes.string,
        onChange: PropTypes.func,
        onItemClick: PropTypes.func,
        onSearch: PropTypes.func,
        onSearchCancel: PropTypes.func,
        onSearchTypeEnter: PropTypes.func,
        multiple: PropTypes.bool,
        itemSelectedClassName: PropTypes.string,
        itemSelectedInnerClassName: PropTypes.string,
        afterInputContainer: PropTypes.object,
    };

    static defaultProps = {
        value: [],
        items: [],
        name: '',
        onChange: null,
        onItemClick: null,
        onSearch: null,
        onSearchCancel: null,
        onSearchTypeEnter: null,
        multiple: true,
        itemSelectedClassName: '',
        itemSelectedInnerClassName: '',
        afterInputContainer: null,
    };

    _dropdown = null;
    _bounds = null;
    _search = null;

    _enum = null;

    constructor(props)
    {
        super(props);
        this.extendState({
            opened: false,
            up: false,
            displayedItems: [], // currently shown items in the dropdown
        });

        this.onDropDownScroll = this.onDropDownScroll.bind(this);
        this.onItemRemoveClick = this.onItemRemoveClick.bind(this);
        this.onContainerClick = this.onContainerClick.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onSearchKeyDown = this.onSearchKeyDown.bind(this);
        this.onSearchKeyUp = _.debounce(this.onSearchKeyUp.bind(this), 300);
        this.onWindowMetricChange = this.onWindowMetricChange.bind(this);
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    }

    componentDidMount()
    {
        $(window.document).on('click', this.onDocumentClick);
    }

    componentWillUnmount()
    {
        $(window.document).off('click', this.onDocumentClick);
        this.unBindDropDownEvents();
    }

    bindDropDownEvents() {
        this.onApplication('window-metrics', this.onWindowMetricChange);
        $(window.document).on('keydown', this.onDocumentKeyDown);
    }

    unBindDropDownEvents() {
        this.offApplication('window-metrics', this.onWindowMetricChange);
        $(window.document).off('keydown', this.onDocumentKeyDown);
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

    onWindowMetricChange() {
        this.updateDirection();
    }

    onDocumentKeyDown(e) {
        if (e.key === 'Escape') {
            this.closeDropDown();
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
        this.startSearch();
    }

    startSearch(reset = false)
    {
        if (reset && this._search)
        {
            this._search.value = '';
        }

        this.openDropDown(() => {
            this.focusSearch();
        }, '', reset);
    }

    getOnChange()
    {
        if (_.isFunction(this.props.onChange))
        {
            return this.props.onChange;
        }

        return e => e;
    }

    onChange(value)
    {
        this.getOnChange()(value);
    }

    onSearchKeyDown(e)
    {
        if (e.key === 'Backspace' && this._search.value === '')
        {
            if (this.isMultiple())
            {
                // remove last item
                const newVal = _.clone(this.getValue());
                newVal.pop();
                this.onChange(newVal);
            }
            else
            {
                this.onChange('');
            }
        }

        if (e.key === 'Enter')
        {
            if (_.isFunction(this.props.onSearchTypeEnter))
            {
                this.props.onSearchTypeEnter(e);
            }
        }
    }

    onSearchKeyUp(e)
    {
        if (!this._search)
        {
            return;
        }

        const search = this._search.value;
        this.setState({
            displayedItems: this.getItems(search),
        }, () => {
            if (_.isFunction(this.props.onSearch))
            {
                this.props.onSearch(search, this.state.displayedItems);
            }
        });
    }

    updateDirection() {
        const pos = this._dropdown.getBoundingClientRect();

        if (window.innerHeight > pos.height) {
            if (!this.isUp() && (pos.top + pos.height >= window.innerHeight)) {
                this.setUp();
            }

            if (this.isUp() && pos.top <= 0) {
                this.setDown();
            }
        }
    }

    isUp() {
        return this.state.up;
    }

    setUp() {
        this.setState({
            up: true,
        });
    }

    setDown() {
        this.setState({
            up: false,
        });
    }

    getHeight(el)
    {
        return el.getBoundingClientRect().height;
    }

    getEnum()
    {
        if (!this._enum)
        {
            if (this.props.items instanceof Enum)
            {
                this._enum = this.props.items;
            }
            else if (_.isArray(this.props.items))
            {
                return new Enum(this.props.items);
            }
        }

        return this._enum;
    }

    getValue()
    {
        return this.props.value;
    }

    getName()
    {
        return this.props.name || '';
    }

    isMultiple()
    {
        return this.props.multiple;
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

    openDropDown(cb, search = '', reset = false)
    {
        if (!this.state.opened || reset)
        {
            this.setState({
                opened: true,
                up: false,
                displayedItems: this.getItems(search),
            }, () => {
                this.bindDropDownEvents();
                this.updateDirection();
                if (_.isFunction(cb)) {
                    cb();
                }
            });
        }
        else
        {
            if (_.isFunction(cb)) {
                cb();
            }
        }
    }

    closeDropDown()
    {
        if (this.state.opened)
        {
            this.setState({
                opened: false,
            }, () => {
                if (_.isFunction(this.props.onSearchCancel))
                {
                    this.props.onSearchCancel();
                }
            });
            this.unBindDropDownEvents();
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
        if (this.isMultiple())
        {
            this.onChange(_.difference(this.getValue(), [item]));
        }
        else
        {
            this.onChange('');
        }
        // to prevent the conflict with .onContainerClick()
        e.stopPropagation();
    }

    onItemSelect(item)
    {
        this.onChange(item);
        this.closeDropDown();
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

    renderDropDownItem(item)
    {
        if (!this.isMultiple())
        {
            return (
                <div
                    className="selectbox__dropdown-item"
                    key={item.value+item.label}
                    onClick={this.onItemSelect.bind(this, item.value)}
                >
                    <div className="selectbox__dropdown-item-text">
                        {item.label}
                    </div>
                </div>
            );
        }

        return (
            <label className="selectbox__dropdown-item" key={item.value+item.label}>
                <input
                    type="checkbox"
                    className="selectbox__dropdown-item-checkbox"
                    checked={this.isItemSelected(item.value)}
                    onChange={this.onItemToggleChange.bind(this, item.value)}
                />
                <div className="selectbox__dropdown-item-text padding-l_x2">
                    {item.label}
                </div>
            </label>
        );
    }

    render()
    {
        const value = this.getUnifiedValue();
        
        return (
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
                            value.map((key) => {
                                const item = this.getEnum().getItemByKey(key);

                                let color = item.color || '';
                                if (color)
                                {
                                    color = `b-color_${color}`;
                                }

                                return (
                                    <div
                                        className={`selectbox__item-selected selectbox__item-selected_removable selectbox__item-id-${key.toString()} ${color} ${this.props.itemSelectedClassName}`}
                                        key={key}
                                        onClick={_.isFunction(this.props.onItemClick) ? Util.passCtx(this.props.onItemClick, [key]) : null}
                                    >
                                        <div className={`selectbox__item-selected-inner ${this.props.itemSelectedInnerClassName}`}>
                                            <div className="selectbox__item-selected-text">
                                                {this.getEnum().getValue(key)}
                                            </div>
                                            <input
                                                value={key}
                                                name={this.getName()}
                                                type="hidden"
                                            />
                                            <div
                                                className="selectbox__item-selected-remove"
                                                onClick={Util.passCtx(this.onItemRemoveClick, [key])}
                                            >
                                                <div className="selectbox__item-selected-remove-icon" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                        {
                            this.isOpened()
                            &&
                            <div className="selectbox__input-container">
                                <input
                                    type="text"
                                    className="selectbox__input"
                                    ref={ ref => {this._search = ref; }}
                                    onKeyDown={this.onSearchKeyDown}
                                    onKeyUp={this.onSearchKeyUp}
                                />
                                {this.props.afterInputContainer}
                            </div>
                        }
                    </div>
                    {
                        this.isOpened() && this.state.displayedItems.length > 0
                        &&
                        <div
                            className={`selectbox__dropdown ${this.isUp() ? 'selectbox__dropdown_up' : ''}`}
                            ref={ ref => {this._dropdown = ref; }}
                            onWheel={this.onDropDownScroll}
                        >
                            <div
                                className="selectbox__dropdown-scope"
                                ref={ ref => {this._bounds = ref; }}
                            >
                                {
                                    this.state.displayedItems.map((item) => {
                                        return (this.renderDropDownItem(item));
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}
