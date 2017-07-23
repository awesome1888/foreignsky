import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import PageScroll from '../../../../lib/util/page-scroll/page-scroll.js';

export default class PageNavigation extends Component {

    static propTypes = {
        page: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
        onPageSelect: PropTypes.func.isRequired,
    };

    static defaultProps = {
        page: 1,
        pageSize: 10,
        count: 0,
        onPageSelect: null,
    };

    onClick(page) {
        // PageScroll.scrollTo();
        if (_.isFunction(this.props.onPageSelect))
        {
            this.props.onPageSelect(page);
        }
    }

    get pageCount()
    {
        return Math.ceil(this.props.count / this.props.pageSize);
    }

    get page()
    {
        return this.props.page;
    }

    render() {
        const pageCount = this.pageCount;
        const page = this.page;
        return (
            <div>
                {
                    page > 1
                    &&
                    <div className="pagination__group">
                        <a className="pagination__link" href="" onClick={this.onClick.bind(this, 1)} >
                            <img className="pagination__icon" src="/images/icons/page_first.png" alt="" />
                        </a>
                        <a className="pagination__link" href="" onClick={this.onClick.bind(this, page - 1)}>
                            <img className="pagination__icon" src="/images/icons/page_prev.png" alt="" />
                        </a>
                    </div>
                }
                <div className="pagination__group">
                    <span className="pagination__current-page">
                      Page <span className="text_weight_bold">{page}</span> of <span className="text_weight_bold">{pageCount}</span>
                    </span>
                </div>
                {
                    page < pageCount
                    &&
                    <div className="pagination__group">
                        <a className="pagination__link" href="" onClick={this.onClick.bind(this, page + 1)}>
                            <img className="pagination__icon" src="/images/icons/page_next.png" alt="" />
                        </a>
                        <a className="pagination__link" href="" onClick={this.onClick.bind(this, pageCount)} >
                            <img className="pagination__icon" src="/images/icons/page_last.png" alt="" />
                        </a>
                    </div>
                }
            </div>
        );
    }
}
