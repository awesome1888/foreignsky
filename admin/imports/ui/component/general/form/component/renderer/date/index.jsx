import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

import { Button, Header, Modal, Form } from 'semantic-ui-react';
import moment from 'moment';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';

import './style.less';

class RendererDate extends RendererGeneric
{
    constructor(props)
    {
        super(props);
        this.extendState({
            opened: false,
        });

        this.onCloseClick = this.onCloseClick.bind(this);
        this.onOpenClick = this.onOpenClick.bind(this);
    }

    onCloseClick()
    {
        this.setState({
            opened: false,
        });
    }

    onOpenClick()
    {
        this.setState({
            opened: true,
        });
    }

    onUpdateClick()
    {

    }

    renderMYSelectors()
    {
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
                        <select name="" id="">
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                        </select>
                    </Form.Field>
                    <Form.Field
                        inverted
                        width={6}
                    >
                        <input type="text" value="1988" />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }

    renderGridRow(from, to)
    {
        const row = [];
        for(let k = from; k <= to; k++)
        {
            row.push(
                <Button
                    basic
                    color='red'
                    inverted
                    onClick={this.onCloseClick.bind(this, false)}
                    className="date-picker__grid-day"
                    key={k}
                >
                    {k}
                </Button>
            );
        }

        return (
            <div className="date-picker__grid-row-outer">
                <div className="date-picker__grid-row">
                    {row}
                </div>
            </div>
        );
    }

    renderGrid()
    {
        return (
            <div className="date-picker__grid">
                {this.renderGridRow(1, 7)}
                {this.renderGridRow(8, 14)}
                {this.renderGridRow(15, 21)}
                {this.renderGridRow(22, 28)}
            </div>
        );
    }

    renderSelector()
    {
        return (
            <Modal
                open={this.state.opened}
                onClose={this.onCloseClick}
                basic
                className="modal_size_mini-custom"
                closeOnDimmerClick={false}
            >
                <Header icon='date' content={`Pick-a-${this.props.attribute.getTitle()}`} />
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

    renderDate()
    {
        return (
            <div className="">
                {moment(this.getValue()).format('DD MMMM YYYY')}
            </div>
        );
    }

    render()
    {
        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <div className="date-picker">
                    <div
                        className="date-picker__opener"
                        onClick={this.onOpenClick}
                    >
                        <div className="date-picker__display">
                            {this.renderDate()}
                            <div className="date-picker__display-icon" />
                        </div>
                    </div>
                    <input
                        type="hidden"
                        name={this.getName()}
                        onChange={this.getOnChange()}
                        value={this.getValue()}
                    />
                    {this.renderSelector()}
                </div>
            </Container>
        );
    }
}

export default connectField(RendererDate, {});
