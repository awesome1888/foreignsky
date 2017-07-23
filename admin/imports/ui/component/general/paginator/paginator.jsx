import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import PageScroll from '../../../../lib/util/page-scroll/page-scroll.js';

export default class Paginator extends Component {
    static propTypes = {
        // This component gets the task to display through a React prop.
        // We can use propTypes to indicate it is required
        activePage: PropTypes.number.isRequired,
        itemsCountPerPage: PropTypes.number.isRequired,
        totalItemsCount: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        activePage: 1,
        itemsCountPerPage: 10,
        totalItemsCount: 0,
        onChange: null,
    };

    onClick(pageNumber) {
        // PageScroll.scrollTo();
        this.props.onChange(pageNumber);
    }

    render() {
        const totalPages = Math.ceil(this.props.totalItemsCount / this.props.itemsCountPerPage);
        const activePage = this.props.activePage;
        return (
            <div>
                {
                    activePage > 1
                    &&
                    <div className="pagination__group">
                        <a className="pagination__link" href="" onClick={this.onClick.bind(this, 1)} >
                            <img className="pagination__icon" src="/images/icons/page_first.png" alt="" />
                        </a>
                        <a className="pagination__link" href="" onClick={this.onClick.bind(this, activePage - 1)}>
                            <img className="pagination__icon" src="/images/icons/page_prev.png" alt="" />
                        </a>
                    </div>
                }
                <div className="pagination__group">
                    <span className="pagination__current-page">
                      Page <span className="text_weight_bold">{activePage}</span> of <span className="text_weight_bold">{totalPages}</span>
                    </span>
                </div>
                {
                    activePage < totalPages
                    &&
                    <div className="pagination__group">
                        <a className="pagination__link" href="" onClick={this.onClick.bind(this, activePage + 1)}>
                            <img className="pagination__icon" src="/images/icons/page_next.png" alt="" />
                        </a>
                        <a className="pagination__link" href="" onClick={this.onClick.bind(this, totalPages)} >
                            <img className="pagination__icon" src="/images/icons/page_last.png" alt="" />
                        </a>
                    </div>
                }
            </div>
        );
    }
}
