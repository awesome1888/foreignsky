import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import TinyMCE from 'react-tinymce';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';

class RichRenderer extends RendererGeneric
{
    onContentChange(e)
    {
        console.log(e.target.getContent());
    }

    render()
    {
        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <TinyMCE
                    content="<p>This is the initial content of the editor</p>"
                    config={{
                        plugins: 'autolink link image lists print preview',
                        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright',
                    }}
                    onChange={this.onContentChange.bind(this)}
                />

                <input
                    type="hidden"
                    name={this.getName()}
                    onChange={this.getOnChange()}
                    value={this.getValue()}
                />
            </Container>
        );
    }
}

export default connectField(RichRenderer, {});
