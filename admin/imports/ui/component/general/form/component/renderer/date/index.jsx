import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

import { Button, Header, Modal } from 'semantic-ui-react';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';

class RendererDate extends RendererGeneric
{
    constructor(props)
    {
        super(props);
        this.extendState({
            opened: true,
        });
    }

    onCloseClick()
    {
        this.setState({
            opened: false,
        });
    }

    onSaveClick()
    {

    }

    renderGrid()
    {
        return null;
    }

    renderSelector()
    {
        return (
            <Modal open={this.state.opened} basic size='small'>
                <Header icon='date' content={`Pick new ${this.props.attribute.getTitle()}`} />
                <Modal.Content>
                    {this.renderGrid()}
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        basic
                        color='red'
                        inverted
                        onClick={this.onCloseClick.bind(this, false)}
                    >
                        Close
                    </Button>
                    <Button
                        color='green'
                        inverted
                        onClick={this.onSaveClick.bind(this, true)}
                    >
                        Save
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

    render()
    {
        console.dir(this.props);
        
        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <input
                    type="text"
                    name={this.getName()}
                    onChange={this.getOnChange()}
                    value={this.getValue()}
                />
                {this.renderSelector()}
            </Container>
        );
    }
}

export default connectField(RendererDate, {});
