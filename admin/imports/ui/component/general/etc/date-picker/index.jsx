import React from 'react';

import BaseComponent from '../../../../../lib/base/component/component.jsx';

import { Button, Header, Modal, Form } from 'semantic-ui-react';
import moment from 'moment';

import './style.less';
import PropTypes from 'prop-types';

export default class DatePicker extends BaseComponent
{
    static propTypes = {
        opened: PropTypes.bool,
        chosen: PropTypes.instanceOf(Date),
        title: PropTypes.string,
        onChange: PropTypes.func,
        onClose: PropTypes.func,
    };

    static defaultProps = {
        opened: false,
        chosen: null,
        title: 'Date',
        onChange: null,
        onClose: null,
    };

    _monthSelector = null;

    constructor(props)
    {
        super(props);
        this.extendState({
            displayed: this.makeDisplayed(),
            chosen: this.dateLocalToUTC(this.props.chosen),
        });

        this.onUpdateClick = this.onUpdateClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onMonthChange = this.onMonthChange.bind(this);
        this.onYearIncrementClick = this.onYearIncrementClick.bind(this);
        this.onYearDecrementClick = this.onYearDecrementClick.bind(this);
    }

    componentWillReceiveProps(props)
    {
        if ('opened' in props && props.opened)
        {
            // picker will be opened
            this.setState({
                displayed: this.makeDisplayed(), // reset displayed
                chosen: this.dateLocalToUTC(props.chosen),
            });
        }
    }

    onUpdateClick()
    {
        if (_.isFunction(this.props.onChange))
        {
            this.props.onChange(this.dateUTCToLocal(this.getChosen()));
        }
    }

    onCloseClick()
    {
        if (_.isFunction(this.props.onClose))
        {
            this.props.onClose();
        }
    }

    onMonthChange()
    {
        this.setState({
            displayed: this.makeDate(1, this._monthSelector.value),
        });
    }

    onYearIncrementClick()
    {
        this.setState({
            displayed: this.makeDate(1, false, this.getDisplayedYear() + 1),
        });
    }

    onYearDecrementClick()
    {
        this.setState({
            displayed: this.makeDate(1, false, this.getDisplayedYear() - 1),
        });
    }

    onDateClick(moment)
    {
        const date = this.makeDate(moment.d, moment.m, moment.y);

        this.setState({
            displayed: date,
            chosen: date,
        });
    }

    makeDate(date = false, month = false, year = false)
    {
        date = date || this.getDisplayedDate();
        month = month !== false ? month : this.getDisplayedMonth();
        year = year !== false ? year : this.getDisplayedYear();

        return new Date(Date.UTC(
            year,
            month,
            date,
            0, // hour
            0, // minute
            0, // second
            0 // millisecond
        ));
    }

    makeDisplayed()
    {
        if (_.isDate(this.props.chosen))
        {
            return this.dateLocalToUTC(this.props.chosen);
        }

        return this.dateLocalToUTC(new Date(Date.now()));
    }

    getDisplayed()
    {
        return this.state.displayed;
    }

    getDisplayedDate()
    {
        return this.getDisplayed().getUTCDate();
    }

    getDisplayedMonth()
    {
        return this.getDisplayed().getUTCMonth();
    }

    getDisplayedYear()
    {
        return this.getDisplayed().getUTCFullYear();
    }

    getChosen()
    {
        return this.state.chosen;
    }

    getChosenDate()
    {
        if (_.isDate(this.getChosen()))
        {
            return this.getChosen().getUTCDate();
        }

        return false;
    }

    getChosenMonth()
    {
        if (_.isDate(this.getChosen()))
        {
            return this.getChosen().getUTCMonth();
        }

        return false;
    }

    getChosenYear()
    {
        if (_.isDate(this.getChosen()))
        {
            return this.getChosen().getUTCFullYear();
        }

        return false;
    }

    getTitle()
    {
        return this.props.title || 'Date';
    }

    generateGrid()
    {
        const date = this.getDisplayed();

        let b = moment.utc(date);
        let f = moment.utc(date);

        const cMonth = f.month();
        const timeLine = [];

        const isChosenMonthYear = b.month() === this.getChosenMonth() && b.year() === this.getChosenYear();
        const chosenDate = this.getChosenDate();

        // generate our calendar grid backward
        let i = 0;
        let pad = 1;
        let decreasePad = false;
        while (i < 50) {
            b = b.add(-1, 'day');

            if (cMonth !== b.month() && !decreasePad)
            {
                // went out of the chosen month borders, now need to pad
                // console.dir('bday = '+b.day());
                pad = b.day();
                decreasePad = true;
            }

            if (pad <= 0)
            {
                break;
            }

            timeLine.unshift({
                wd: b.day(),
                d: b.date(),
                m: b.month(),
                y: b.year(),
                c: !decreasePad && isChosenMonthYear && b.date() === chosenDate,
            });

            if (decreasePad) {
                pad -= 1;
            }
            i += 1; // emergency exit
        }

        i = 0;
        pad = 1;
        decreasePad = false;
        while (i < 50) {
            timeLine.push({
                wd: f.day(),
                d: f.date(),
                m: f.month(),
                y: f.year(),
                c: !decreasePad && isChosenMonthYear && f.date() === chosenDate,
            });

            f = f.add(1, 'day');
            if (cMonth !== f.month() && !decreasePad)
            {
                // went out of the chosen month borders, now need to pad
                // we pad to 6 full weeks to display: 6 weeks * 7 days = 42 days to display
                pad = 42 - timeLine.length;
                decreasePad = true;
            }

            if (pad <= 0)
            {
                break;
            }

            if (decreasePad) {
                pad -= 1;
            }
            i += 1; // emergency exit
        }

        // now group by weeks
        const byWeeks = [];
        let cWeek = [];
        timeLine.forEach((day) => {
            if (day.wd === 1 && _.isArrayNotEmpty(cWeek)) // week starts with monday, monday has number 1
            {
                byWeeks.push(cWeek);
                cWeek = [];
            }

            cWeek.push(day);
        });
        // push the last if not empty, just in case...
        if (_.isArrayNotEmpty(cWeek))
        {
            byWeeks.push(cWeek);
        }

        return {
            cMonth,
            grid: byWeeks
        };
    }

    /**
     * Returns the same date, but with the timezone set to UTC (as it would be if we were in GMT zone now)
     * @param date
     * @returns {Date}
     */
    dateLocalToUTC(date)
    {
        if (!_.isDate(date))
        {
            return null;
        }

        // console.dir(date.toString());
        // console.dir('h = '+date.getHours());
        // console.dir('m = '+date.getMinutes());
        // console.dir('s = '+date.getSeconds());

        return new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(), // hour
            date.getMinutes(), // minute
            date.getSeconds(), // second
            date.getMilliseconds() // millisecond
        ));
    }

    dateUTCToLocal(date)
    {
        return new Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(), // hour
            date.getUTCMinutes(), // minute
            date.getUTCSeconds(), // second
            date.getUTCMilliseconds() // millisecond
        );
    }

    renderMYSelectors()
    {
        const cMonth = this.getDisplayedMonth();
        const cYear = this.getDisplayedYear();
        
        return (
            <Form
                inverted
                className="margin-b_x2"
            >
                <Form.Group>
                    <Form.Field
                        inverted
                        width={10}
                    >
                        <select
                            className="date-picker__selector-month"
                            onChange={this.onMonthChange}
                            ref={(ref) => { this._monthSelector = ref; }}
                        >
                            <option value="0" selected={cMonth === 0}>January</option>
                            <option value="1" selected={cMonth === 1}>February</option>
                            <option value="2" selected={cMonth === 2}>March</option>
                            <option value="3" selected={cMonth === 3}>April</option>
                            <option value="4" selected={cMonth === 4}>May</option>
                            <option value="5" selected={cMonth === 5}>June</option>
                            <option value="6" selected={cMonth === 6}>July</option>
                            <option value="7" selected={cMonth === 7}>August</option>
                            <option value="8" selected={cMonth === 8}>September</option>
                            <option value="9" selected={cMonth === 9}>October</option>
                            <option value="10" selected={cMonth === 10}>November</option>
                            <option value="11" selected={cMonth === 11}>December</option>
                        </select>
                    </Form.Field>
                    <Form.Field
                        inverted
                        width={6}
                        className="date-picker__selector-year"
                    >
                        <input type="text" value={cYear} readOnly />
                        <div className="date-picker__selector-year-buttons">
                            <div
                                className="date-picker__selector-year-add"
                                onClick={this.onYearIncrementClick}
                            />
                            <div
                                className="date-picker__selector-year-remove"
                                onClick={this.onYearDecrementClick}
                            />
                        </div>
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }

    renderWeek(week, i, cMonth)
    {
        const row = [];

        week.forEach((day) => {

            row.push(
                <div
                    onClick={this.onDateClick.bind(this, day)}
                    className={
                        `date-picker__grid-day ${day.c ? 'date-picker__grid-day_chosen' : ''} ${day.m !== cMonth ? 'date-picker__grid-day_other-month' : ''}`
                    }
                    key={`${day.d}-${day.m}-${day.y}`}
                >
                    {day.d}
                </div>
            );
        });

        return (
            <div
                className="date-picker__grid-row-outer"
                key={i}
            >
                <div className="date-picker__grid-row">
                    {row}
                </div>
            </div>
        );
    }

    renderGrid()
    {
        const data = this.generateGrid();

        return (
            <div className="date-picker__grid">
                {
                    data.grid.map((week, i) => {
                        return this.renderWeek(week, i, data.cMonth);
                    })
                }
            </div>
        );
    }

    render()
    {
        if (!this.props.opened) {
            return null;
        }

        return (
            <Modal
                open={this.props.opened}
                onClose={this.onCloseClick}
                basic
                className="modal_size_mini-custom"
                closeOnDimmerClick={true}
            >
                <Header icon='date' content={`Pick-a-${this.getTitle()}, Inc.`} />
                <Modal.Content>
                    {this.renderMYSelectors()}
                    {this.renderGrid()}
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        basic
                        color='red'
                        inverted
                        onClick={this.onCloseClick}
                    >
                        Close
                    </Button>
                    <Button
                        color='green'
                        inverted
                        onClick={this.onUpdateClick.bind(this, true)}
                    >
                        Update
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
