import React from 'react';
import {Meteor} from 'meteor/meteor';
import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import PageNavigation from '../page-navigation/page-navigation.jsx';
import Item from './component/item/item.jsx';
import BaseComponent from '../../../../lib/base/component/component.jsx';
import App from '../../../application.jsx';
import clone from 'clone';

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
        detailPageUrl: PropTypes.string,
    };

    static defaultProps = {
        className: '',
        entity: null,
        detailPageUrl: '',
    };

    _cache = {};

    constructor(params)
    {
        super(params);
        this.extendState({
            page: this.getQueryPage(),
            perPage: this.getPageSize(),
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
        const p = this.getEntity().find(Object.assign({
            select: this.getAttributeCodes(),
        }, this.getPageParameters()));

        App.getInstance().wait(p);

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
            this.setQueryPage(page);
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
    getListItemConstructor()
    {
        return Item;
    }

    getMap()
    {
        // generate from entity, for basic usage
        return this.getEntity().getAttributes();
    }

    getMap()
    {
        if (!this._cache.map)
        {
            this._cache.map = this.declareMap();
            this._cache.mapIndex = this._cache.map.reduce((result, attribute) => {
                result[attribute.code] = attribute;
                return result;
            }, {});
        }

        return this._cache.map;
    }

    /**
     * Use this function to make hooks
     * @returns {*}
     */
    declareMap()
    {
        return this.readMap();
    }

    readMap(chosenFields = null)
    {
        let attributes = this.getEntity().getAttributes();
        if (_.isObjectNotEmpty(chosenFields))
        {
            attributes = attributes.filter(attribute => attribute.code in chosenFields);
        }
        else
        {
            chosenFields = {};
        }

        return attributes.map((attribute) => {
            const copy = clone(attribute, false);
            if (copy.code in chosenFields && _.isObject(chosenFields[copy]))
            {
                Object.assign(copy, _.intersectKeys(chosenFields[copy], {
                    renderer: 1,
                }));
            }

            return copy;
        });
    }

    getMapIndex()
    {
        this.getMap();

        return this._cache.mapIndex;
    }

    getAttributeCodes()
    {
        return Object.keys(this.getMapIndex());
    }

    /**
     * Returns link to the query instance, which execution result we want to display
     * in the list.
     * @abstract
     * @access protected
     */
    getEntity()
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
    getHeaderPrefix()
    {
        return this.getEntity().getTitle();
    }

    /**
     * Returns title labels
     * @returns {[string,string]}
     * @access protected
     */
    getLabels()
    {
        return ['#COUNT# item', '#COUNT# items', 'no items'];
    }

    /**
     * Returns page number specified in the URL
     * @returns {Number}
     * @access protected
     */
    getQueryPage()
    {
        return parseInt(FlowRouter.getQueryParam('page') || 1, 10);
    }

    /**
     * Sets page number back to the URL
     * @param {Number} page
     * @access protected
     */
    setQueryPage(page)
    {
        FlowRouter.setQueryParams({page});
    }

    getPage()
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
        this.getEntity().getCount().then((res) => {
            this.setState({
                count: parseInt(res),
                countReady: true,
            });
            this.setTitle(this.getTitle());
        });
    }

    /**
     * Retrives count from the state
     * @returns {number}
     * @access protected
     */
    getCount() {
        return this.state.count;
    }

    /**
     * Returns the page size for the page navigator
     * @returns {number}
     * @access protected
     */
    getPageSize()
    {
        return 10;
    }

    /**
     * Returns page navigation parameters for the query
     * @returns {{limit: (number|*), skip: number}}
     * @access protected
     */
    getPageParameters()
    {
        return {
            limit: this.state.perPage,
            offset: this.state.perPage * (this.state.page - 1),
        };
    }

    getTitle()
    {
        let title = `${this.getHeaderPrefix()}: `;
        const labels = this.getLabels();

        if (this.getCount() > 0)
        {
            title += this.getCount() === 1 ? labels[0] : labels[1];
            title = title.replace('#COUNT#', this.getCount().toString());
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

    renderHeader()
    {
        return (
            <thead>
                <tr>
                    {
                        this.getMap().map(attribute => {
                            return (
                                <td
                                    key={attribute.code}
                                >
                                    {attribute.label || attribute.code}
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
        parameters = this.mapItemParameters(parameters);
        parameters.entity = this.getEntity();
        parameters.map = this.getMap();
        parameters.detailPageUrl = this.props.detailPageUrl;
        
        return React.createElement(
            this.getListItemConstructor(),
            parameters
        );
    }

    renderList()
    {
        return (
            <tbody>
                {this.state.data.map(item => (
                    this.renderListItem({
                        key: item.getId(),
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
        if (this.getCount() <= this.state.perPage) {
            return null;
        }
        return (
            <div className="pagination_custom margin-top">
                {
                    <PageNavigation
                        page={this.getPage()}
                        pageSize={this.getPageSize()}
                        count={this.getCount()}
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
                        <table className="table table-striped table-bordered wide">
                            {this.renderHeader()}
                            {this.renderList()}
                        </table>

                        {this.renderPageNav()}
                    </div>
                }
            </div>
        );
    }
}
