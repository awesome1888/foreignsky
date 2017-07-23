import React from 'react';
import {Meteor} from 'meteor/meteor';
import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import PageNavigation from '../page-navigation/page-navigation.jsx';
import Item from './component/item/item.jsx';
import BaseComponent from '../../../../lib/base/component/component.jsx';
import App from '../../../../ui/app.jsx';

/**
 * The basic component for making lists
 * @abstract
 */
export default class List extends BaseComponent
{
    static propTypes = {
        className: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object,
        ]),
        entity: PropTypes.func,
    };

    static defaultProps = {
        className: '',
        entity: null,
    };

    constructor(params)
    {
        super(params);
        this.extendState({
            page: this.queryPage,
            perPage: this.pageSize,
            total: 0,
            countReady: false,
            dataReady: false,
            // chosenFilters: this.loadFiltersFromURL(),
            data: [],
        });
        this.url = FlowRouter.current().path;
    }

    componentDidMount()
    {
        this.reLoadData();
    }

    componentWillUpdate()
    {
        this.checkUrl();
    }

    reLoadData()
    {
        this.loadData();
        this.loadCount();
    }

    loadData()
    {
        const p = this.entity.find(Object.assign({
            select: ['title', 'sort', 'color', 'primary'],
        }, this.pageParameters));

        App.instance.wait(p);

        p.then((res) => {
            this.setState({
                data: res,
                dataReady: true,
            });
        });
    }

    /**
     * Updates list when page changes
     * @param {Number} page
     * @returns void
     * @access protected
     */
    onPageChange(page) {
        if (page !== this.state.page) {
            this.queryPage = page;
            this.setState({
                page,
            });
        }
    }

    checkUrl() {
        const urlNow = FlowRouter.current().path;
        const urlBefore = this.url;
        if (urlNow !== urlBefore) {
            this.url = urlNow;
            this.reLoadData();
        }
    }

    /**
     * An alias for reLoadData(), you can pass this to nested components
     */
    onListUpdate() {
        this.reLoadData();
    }

    /**
     * Returns link to the inner list component class
     * @returns {ListInner}
     * @access protected
     */
    get listItemConstructor()
    {
        return Item;
    }

    get map()
    {
        // generate from entity, for basic usage
        return this.entity.attributes;
    }

    /**
     * Returns link to the query instance, which execution result we want to display
     * in the list.
     * @abstract
     * @access protected
     */
    get entity()
    {
        if (this.props.entity !== null)
        {
            return this.props.entity;
        }

        throw new Meteor.Error('Entity not set');
    }

    /**
     * Returns title prefix, if any
     * @returns {string}
     * @access protected
     */
    get headerPrefix()
    {
        return this.entity.title;
    }

    /**
     * Returns title labels
     * @returns {[string,string]}
     * @access protected
     */
    get labels()
    {
        return ['#COUNT# item', '#COUNT# items', 'no items'];
    }

    /**
     * Returns page number specified in the URL
     * @returns {Number}
     * @access protected
     */
    get queryPage()
    {
        return parseInt(FlowRouter.getQueryParam('page') || 1, 10);
    }

    /**
     * Sets page number back to the URL
     * @param {Number} page
     * @access protected
     */
    set queryPage(page)
    {
        FlowRouter.setQueryParams({page});
    }

    get page()
    {
        return this.state.page;
    }

    /**
     * Loads record count by executing the given query
     * @returns void
     * @access protected
     */
    loadCount()
    {
        this.entity.count().then((res) => {
            this.setState({
                count: parseInt(res),
                countReady: true,
            });
            this.setTitle(this.title);
        });
    }

    /**
     * Retrives count from the state
     * @returns {number}
     * @access protected
     */
    get count() {
        return this.state.count;
    }

    /**
     * Returns the page size for the page navigator
     * @returns {number}
     * @access protected
     */
    get pageSize()
    {
        return 10;
    }

    /**
     * Returns page navigation parameters for the query
     * @returns {{limit: (number|*), skip: number}}
     * @access protected
     */
    get pageParameters()
    {
        return {
            limit: this.state.perPage,
            offset: this.state.perPage * (this.state.page - 1),
        };
    }

    get title()
    {
        let title = `${this.headerPrefix}: `;
        const labels = this.labels;

        if (this.count > 0)
        {
            title += this.count === 1 ? labels[0] : labels[1];
            title = title.replace('#COUNT#', this.count);
        }
        else
        {
            title += labels[2];
        }

        return title;
    }

    mapItemParameters(parameters)
    {
        return parameters;
    }

    /**
     * Returns true if all data were loaded
     * @returns {boolean}
     * @access protected
     */
    isReady()
    {
        return this.state.dataReady && this.state.countReady;
    }

    /**
     * Renders list title
     * @returns {XML}
     * @access protected
     */
    renderHeader()
    {
        return this.title;
    }

    renderGridHeader()
    {
        return (
            <thead>
                <tr>
                    {
                        this.map.map(item => {
                            return (
                                <td>
                                    {item.label}
                                </td>
                            );
                        })
                    }
                </tr>
            </thead>
        );
    }

    renderListItem(parameters = {})
    {
        const key = parameters.key;
        parameters = this.mapItemParameters(parameters);
        parameters.key = key; // we always keep key
        parameters.entity = this.entity;

        return React.createElement(
            this.listItemConstructor,
            parameters
        );
    }

    renderItemList()
    {
        return (
            <tbody>
                {this.state.data.map(item => (
                    this.renderListItem({
                        key: item.id,
                        data: item,
                        onListUpdate: this.props.onListUpdate,
                        map: this.map,
                    })
                ))}
            </tbody>
        );
    }

    /**
     * Renders page navigator
     * @returns {XML|null}
     * @access protected
     */
    renderPageNav()
    {
        if (this.count <= this.state.perPage) {
            return null;
        }
        return (
            <div className="pagination_custom margin-top">
                {
                    <PageNavigation
                        page={this.page}
                        pageSize={this.pageSize}
                        count={this.count}
                        onPageSelect={this.onPageChange.bind(this)}
                    />
                }
            </div>
        );
    }

    /**
     * Renders the component
     * @returns {XML}
     * @access protected
     */
    render()
    {
        return (
            <div
                className={`data-block data-block_transparent ${this.props.className}`}
            >
                {
                    this.isReady()
                    &&
                    <div className="">
                        {this.renderHeader()}
                        <table className="table table-striped table-bordered wide">
                            {this.renderGridHeader()}
                            {this.renderItemList()}
                        </table>

                        {this.renderPageNav()}
                    </div>
                }
            </div>
        );
    }
}
