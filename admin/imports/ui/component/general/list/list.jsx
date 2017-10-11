import React from 'react';
import {Meteor} from 'meteor/meteor';
import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import PageNavigation from '../page-navigation/page-navigation.jsx';
import BaseComponent from '../../../../lib/base/component/component.jsx';
// import PageScroll from '../../../../lib/util/page-scroll/page-scroll.js';

import Row from './component/row/index.jsx';
import App from '../../../application.jsx';
import EntityMap from '../../../../startup/client/entity-map.js';
import ModalConfirm from '../modal-confirm/index.jsx';

import { Button, Table } from 'semantic-ui-react';

/**
 * The basic component for making lists
 * @abstract
 */
export default class ListGeneric extends BaseComponent {

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

    _scrolled = false;
    _selected = {};
    _deleteConfirm = null;

    constructor(params)
    {
        super(params);
        this.extendState({
            page: this.getQueryPage(),
            perPage: this.getPageSize(),
            // chosenFilters: this.loadFiltersFromURL(),

            total: 0,
            items: [],
            countReady: false,
            dataReady: false,
        });
        this._cache.query = null;
        this._cache.queryParams = null;
        this.url = null;

        this.transformModel = this.transformModel.bind(this);

        this.onDeleteSelectedClick = this.onDeleteSelectedClick.bind(this);
        this.onItemSelectorChange = this.onItemSelectorChange.bind(this);
    }

    // component init routines

    componentWillMount()
    {
        this._scrolled = false;
    }

    componentDidMount()
    {
        this.startDataReload();
    }

    componentDidUpdate()
    {
        this.scrollIfReady();
    }

    scrollIfReady()
    {
        if (this.isReady() && !this._scrolled)
        {
            // PageScroll.scrollToStored();
            this._scrolled = true;
        }
    }

    // data load routines

    /**
     * Main routine that starts after the component get mounted
     * or every time the component get updated
     * @returns void
     * @access protected
     */
    startDataReload()
    {
        this.getQueryParameters().then((parameters) => {
            this._cache.queryParams = parameters;
            this.reLoadData();
        });
    }

    /**
     * Reloads current data and count, based on the cached query parameters given
     * inside startDataReload()
     * @returns void
     * @access protected
     */
    reLoadData()
    {
        this._selected = {};
        this.setState({
            countReady: false,
            dataReady: false,
        });
        this.loadData();
        this.loadCount();
    }

    /**
     * An alias for startDataReload(), you can pass this to nested components
     */
    onListUpdate()
    {
        this.startDataReload();
    }

    onItemSelectorChange(way, item)
    {
        this._selected[item.getId()] = way;
    }

    onDeleteSelectedClick()
    {
        if (!_.isObjectNotEmpty(this._selected))
        {
            return;
        }

        const toDelete = [];
        _.forEach(this._selected, (state, id) => {
            if (state)
            {
                toDelete.push(id);
            }
        });

        if (!_.isArrayNotEmpty(toDelete))
        {
            return;
        }

        this._deleteConfirm.ask(
            `Do you want to remove selected items (${toDelete.length})? The items will be permanently lost.`,
            'An important question'
        ).then((answer) => {
            if (answer)
            {
                this.getEntity().remove({
                    _id: {$in: toDelete},
                }).then(() => {
                    this.startDataReload();
                });
            }
        });
    }

    // loadFiltersFromURL() {
    //     const chosenFilters = {};
    //     const fs = this.getFilterSettings();
    //     if (!_.isObjectNotEmpty(fs)) {
    //         return chosenFilters;
    //     }
    //     _.each(fs.fields, (filter) => {
    //         if (FlowRouter.getQueryParam(filter.field)) {
    //             chosenFilters[filter.field] = [];
    //             _.each(FlowRouter.getQueryParam(filter.field).split(';'), (value) => {
    //                 if (filter.type === BarFilterTypes.SEARCHBOX) {
    //                     chosenFilters[filter.field].push(value);
    //                 } else if (_.contains(filter.values.map(el => el.value), value)) {
    //                     chosenFilters[filter.field].push(value);
    //                 }
    //             });
    //         }
    //     });
    //     return chosenFilters;
    // }

    // getCurrentFilter() {
    //     return this.state.chosenFilters;
    // }
    //
    // onReset() {
    //     this.resetUrl();
    // }
    //
    // getCleanChosenFilters() {
    //     return {};
    // }

    // getCleanUrlParameters() {
    //     const params = {};
    //     params.page = null;
    //     _.each(this.getFilterSettings().fields, (filter) => {
    //         params[filter.field] = null;
    //     });
    //
    //     return params;
    // }

    // resetUrl() {
    //     FlowRouter.setQueryParams(this.getCleanUrlParameters());
    // }

    /**
     * On filter rest, set page, chosen filters to empty and url
     */
    // handleFiltersReset() {
    //     this.resetUrl();
    //
    //     this.reInitializeList(this.getCleanChosenFilters());
    // }

    /**
     * On change filters, get new data and set url
     * @param filter
     * @param values
     */
    // handleFilterChange(filter, values) {
    //     const chosenFilters = _.clone(this.getCurrentFilter());
    //     chosenFilters[filter] = values.map(el => el.value);
    //
    //     const params = {};
    //     params.page = 1;
    //     params[filter] = chosenFilters[filter].join(';');
    //     FlowRouter.setQueryParams(params);
    //
    //     this.reInitializeList(chosenFilters);
    // }

    // reInitializeList(chosenFilters) {
    //     this.setState({
    //         chosenFilters,
    //         page: 1,
    //     }, () => {
    //         this.startDataReload();
    //     });
    // }

    /**
     * Returns query parameters. It can be async in implementations, for example, if
     * we need to get some remote criteria asynchronously before building the list
     * @returns {Promise.<{}>}
     * @access protected
     */
    async getQueryParameters()
    {
        return {
            select: '*', // select all by default
        };
    }

    mixPageParameters(params)
    {
        return Object.assign(_.clone(params), {
            limit: this.getPageSize(),
            offset: this.getPageSize() * (this.getPage() - 1),
        });
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

    getMap()
    {
        return this.getEntity().getMap().filter((a) => {
            // show only auto-selectable attributes
            return a.isAutoSelectable();
        });
    }

    transformMap(map)
    {
        return map;
    }

    getMapTransformed()
    {
        if (!this._cache.map)
        {
            this._cache.map = this.transformMap(this.getMap());
            // todo: pre-sort here by order!!!
        }

        return this._cache.map;
    }

    loadData()
    {
        const qParams = this._cache.queryParams;
        if (!qParams)
        {
            throw new Meteor.Error('Calling loadData() while query params are not ready');
        }
        const params = this.mixPageParameters(qParams);
        const p = this.getEntity().find(params);

        App.getInstance().wait(p);

        p.then((res) => {
            this.setData(res);
        }, (err) => {
            this.showConsoleError('Unable to get items (maybe forgot to expose?)', err);
        });
    }

    transformModel(data)
    {
        return data;
    }

    setData(data)
    {
        this.setState({
            data: data.map(this.transformModel),
            dataReady: true,
        });
    }

    /**
     * Loads record count by executing the given query
     * @returns void
     * @access protected
     */
    loadCount()
    {
        const qParams = this._cache.queryParams;
        if (!qParams)
        {
            throw new Meteor.Error('Calling loadCount() while query params are not ready');
        }

        this.getEntity().getCount(qParams.filter || {}).then((res) => {
            this.setCount(res);
            this.setTitle(this.getTitle());
        });
    }

    setCount(count)
    {
        this.setState({
            total: parseInt(count),
            countReady: true,
        });
    }

    /**
     * Retrives count from the state
     * @returns {number}
     * @access protected
     */
    getCount()
    {
        return this.state.total;
    }

    // pagination

    /**
     * Updates list when page changes
     * @param {Number} page
     * @returns void
     * @access protected
     */
    onPageChange(page)
    {
        if (page !== this.state.page) {
            this.setQueryPage(page); // update page in url
            this.setState({
                page,
            }, () => {
                this.loadData();
            });
        }
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

    getPage()
    {
        return this.state.page;
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

    // presentation

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
        return (
            this._cache.queryParams // async qparams ready
            &&
            this.state.countReady // we loaded count
            &&
            this.state.dataReady // we loaded items
        );
    }

    /**
     * Returns link to the inner list component class
     * @returns {ListInner}
     * @access protected
     */
    getListItemConstructor()
    {
        return Row;
    }

    /**
     * Renders list title
     * @param prefix
     * @returns {XML}
     * @access protected
     */
    renderHeader()
    {
        return (
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell />
                    {
                        this.getMapTransformed().map(attribute => {
                            return (
                                <Table.HeaderCell
                                    key={attribute.getCode()}
                                >
                                    {attribute.getTitle()}
                                </Table.HeaderCell>
                            );
                        })
                    }
                </Table.Row>
            </Table.Header>
        );
    }

    renderListItem(parameters = {})
    {
        parameters = this.mapItemParameters(parameters);
        parameters.entity = this.getEntity();
        parameters.map = this.getMapTransformed();
        parameters.detailPageUrl = this.props.detailPageUrl;

        return React.createElement(
            this.getListItemConstructor(),
            parameters
        );
    }

    renderItems()
    {
        return (
            <Table.Body>
                {
                    this.state.data.map(item => (
                        this.renderListItem({
                            key: item.getId(),
                            data: item,
                            onListUpdate: this.props.onListUpdate,
                            map: this.map,
                            onSelectorChange: this.onItemSelectorChange,
                        })
                    ))
                }
            </Table.Body>
        );
    }

    /**
     * Renders page navigator
     * @returns {XML|null}
     * @access protected
     */
    renderPageNav()
    {
        if (!this.isReady() || (this.getCount() <= this.state.perPage))
        {
            return null;
        }

        return (
            <PageNavigation
                page={this.getPage()}
                pageSize={this.getPageSize()}
                count={this.getCount()}
                onPageSelect={this.onPageChange.bind(this)}
            />
        );
    }

    /**
     * Renders the component
     * @returns {XML}
     * @access protected
     */
    render()
    {
        if (!this.isReady())
        {
            return null;
        }

        const url = EntityMap.makeDetailPath(this.getEntity(), 0);
        const title = this.getEntity().getTitle();

        return (
            <div>
                <Table compact celled definition>
                    {this.renderHeader()}
                    {this.renderItems()}

                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell colSpan='4'>
                                {this.renderPageNav()}
                                <Button size='large' color='green' floated='right' href={url}>New {_.lCFirst(title)}</Button>
                                <Button
                                    size="large"
                                    onClick={this.onDeleteSelectedClick}
                                >
                                    Delete
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                <ModalConfirm ref={ref => { this._deleteConfirm = ref; }} />
            </div>
        );
    }
}
