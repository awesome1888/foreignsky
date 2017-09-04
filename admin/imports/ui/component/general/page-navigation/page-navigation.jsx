import React from 'react';
import PropTypes from 'prop-types';
// import PageScroll from '../../../../lib/util/page-scroll/page-scroll.js';
import BaseComponent from '../../../../lib/base/component/component.jsx';

import { Menu } from 'semantic-ui-react';

export default class PageNavigation extends BaseComponent
{
    static propTypes = {
        page: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
        onPageSelect: PropTypes.func.isRequired,
        isSmall: PropTypes.bool,
    };

    static defaultProps = {
        page: 1,
        pageSize: 10,
        count: 0,
        onPageSelect: null,
        isSmall: false,
    };

    constructor(props)
    {
        super(props);
        this.onPreviousPageClick = this.onPreviousPageClick.bind(this);
        this.onNextPageClick = this.onNextPageClick.bind(this);
    }

    onPageClick(page) {
        // PageScroll.scrollTo();
        if (_.isFunction(this.props.onPageSelect))
        {
            this.props.onPageSelect(page);
        }
    }

    onPreviousPageClick()
    {
        if (this.getPage() > 1)
        {
            this.onPageClick(this.getPage() - 1);
        }
    }

    onNextPageClick()
    {
        if (this.getPage() < this.getPageCount())
        {
            this.onPageClick(this.getPage() + 1);
        }
    }

    getPageCount()
    {
        return Math.ceil(this.props.count / this.props.pageSize);
    }

    getPage()
    {
        return this.props.page || 1;
    }

    getRadius()
    {
        return 2;
    }

    getRange()
    {
        const pageCount = this.getPageCount();
        const page = this.getPage();
        const radius = this.getRadius();

        const r = [page - radius, page + radius];
        if (r[0] < 1)
        {
            r[1] += 1 - r[0];
            r[0] = 1;
            if (r[1] > pageCount)
            {
                r[1] = pageCount;
            }
        }

        if (r[1] > pageCount)
        {
            r[0] -= r[1] - pageCount;
            r[1] = pageCount;
            if (r[0] < 1)
            {
                r[0] = 1;
            }
        }

        return r;
    }

    renderRange() {
        const r = [];
        const range = this.getRange();

        for(let k = range[0]; k <= range[1]; k++)
        {
            r.push(
                <Menu.Item
                    // href={`?page=${k}`}
                    key={k}
                    active={this.getPage() === k}
                    onClick={this.onPageClick.bind(this, k)}
                >
                    {k}
                </Menu.Item>
            );
        }

        return r;
    }

    render() {
        return (
            <Menu
                floated='right'
                size='mini'
                pagination
                className={this.props.isSmall ? 'pagenav_small' : ''}
            >
                <Menu.Item
                    // href="?page=1"
                    icon
                    onClick={this.onPreviousPageClick}
                >
                    <div className='left chevron' />
                </Menu.Item>
                {this.renderRange()}
                <Menu.Item
                    // href={`?page=${this.getPageCount()}`}
                    icon
                    onClick={this.onNextPageClick}
                >
                    <div className='right chevron' />
                </Menu.Item>
            </Menu>
        );
    }
}
