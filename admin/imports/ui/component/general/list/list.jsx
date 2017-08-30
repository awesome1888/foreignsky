import React from 'react';
import {Meteor} from 'meteor/meteor';
import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import PageNavigation from '../page-navigation/page-navigation.jsx';
import Row from './component/row/index.jsx';
import BaseComponent from '../../../../lib/base/component/component.jsx';
import App from '../../../application.jsx';

import { Button, Checkbox, Icon, Table, Menu } from 'semantic-ui-react';

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
            <thead>
                <tr>
                    {
                        this.getMapTransformed().map(attribute => {
                            return (
                                <td
                                    key={attribute.getCode()}
                                >
                                    {attribute.getTitle()}
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
        parameters.map = this.getMapTransformed();
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
            <Table compact celled definition>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Registration Date</Table.HeaderCell>
                        <Table.HeaderCell>E-mail address</Table.HeaderCell>
                        <Table.HeaderCell>Premium Plan</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row>
                        <Table.Cell collapsing>
                            <Checkbox slider />
                        </Table.Cell>
                        <Table.Cell>John Lilki</Table.Cell>
                        <Table.Cell>September 14, 2013</Table.Cell>
                        <Table.Cell>jhlilk22@yahoo.com</Table.Cell>
                        <Table.Cell>No</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell collapsing>
                            <Checkbox slider />
                        </Table.Cell>
                        <Table.Cell>Jamie Harington</Table.Cell>
                        <Table.Cell>January 11, 2014</Table.Cell>
                        <Table.Cell>jamieharingonton@yahoo.com</Table.Cell>
                        <Table.Cell>Yes</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell collapsing>
                            <Checkbox slider />
                        </Table.Cell>
                        <Table.Cell>Jill Lewis</Table.Cell>
                        <Table.Cell>May 11, 2014</Table.Cell>
                        <Table.Cell>jilsewris22@yahoo.com</Table.Cell>
                        <Table.Cell>Yes</Table.Cell>
                    </Table.Row>
                </Table.Body>

                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell colSpan='4'>
                            <Menu floated='right' size='mini' pagination>
                                <Menu.Item as='a' icon>
                                    <Icon name='left chevron' />
                                </Menu.Item>
                                <Menu.Item as='a'>1</Menu.Item>
                                <Menu.Item as='a'>2</Menu.Item>
                                <Menu.Item as='a'>3</Menu.Item>
                                <Menu.Item as='a'>4</Menu.Item>
                                <Menu.Item as='a' icon>
                                    <Icon name='right chevron' />
                                </Menu.Item>
                            </Menu>

                            {/*icon*/}
                            <Button size='small' color='#fff' floated='right'>New article</Button>

                            <Button size='small' color='red'>Remove</Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        );

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

                        <div className="margin-bottom">
                            <a href={this.props.detailPageUrl.replace('#ID#', '0')}>+ Add</a>
                        </div>

                        {this.renderPageNav()}
                    </div>
                }
            </div>
        );
    }
}
