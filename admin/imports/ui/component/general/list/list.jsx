import React from 'react';
import {Meteor} from 'meteor/meteor';
import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import PageNavigation from '../page-navigation/page-navigation.jsx';
import Row from './component/row/index.jsx';
import BaseComponent from '../../../../lib/base/component/component.jsx';
import App from '../../../application.jsx';
import EntityMap from '../../../../startup/client/entity-map.js';
// import Util from '../../../../lib/util.js';

import { Button, Table } from 'semantic-ui-react';

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
        this.setState({
            countReady: false,
            dataReady: false,
        });
        this.loadData();
        this.loadCount();
    }

    loadData()
    {
        console.dir(this.getQueryParameters());
        const p = this.getEntity().find(this.getQueryParameters());

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
            this.loadData();
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
        return Row;
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

    // getMapIndex()
    // {
    //     this.getMap();
    //
    //     return this._cache.mapIndex;
    // }

    // getAttributeCodes()
    // {
    //     return Object.keys(this.getMapIndex());
    // }

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
    getQueryParameters()
    {
        return {
            select: '*',
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

        return (
            <thead>
                <tr>

                </tr>
            </thead>
        );
    }

    renderList()
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
                        })
                    ))
                }
            </Table.Body>
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
            <Table compact celled definition>
                {this.renderHeader()}
                {this.renderList()}

                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell colSpan='4'>
                            {this.renderPageNav()}
                            <Button size='large' color='green' floated='right' href={url}>New {_.lCFirst(title)}</Button>
                            <Button size='large'>Delete</Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        );
    }
}
