import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

import moment from 'moment';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';

import DatePicker from '../../../../../../component/general/aux/date-picker/index.jsx';

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

    renderSelector()
    {
        return (
            <DatePicker
                title={this.props.attribute.getTitle()}
                current={this.getValue()}
                opened={this.state.opened}
                onClose={this.onCloseClick}
            />
        );
    }

    renderDate()
    {
        // DD MMMM YYYY HH:mm:ss

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
                <div className="date-field">
                    <div
                        className="date-field__opener"
                        onClick={this.onOpenClick}
                    >
                        <div className="date-field__display">
                            {this.renderDate()}
                            <div className="date-field__display-icon" />
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
