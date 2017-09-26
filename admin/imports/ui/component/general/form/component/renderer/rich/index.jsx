import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import TinyMCE from 'react-tinymce';
import tinymce from 'tinymce'; // dont remove, implicitly used

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';

class RichRenderer extends RendererGeneric
{
    onContentChange(e)
    {
        this.props.onChange(e.target.getContent());
    }

    render()
    {
        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <TinyMCE
                    content={this.getValue()}
                    config={{
                        // plugins: 'autolink link image lists print preview',
                        toolbar: 'undo redo | bold italic forecolor backcolor | alignleft aligncenter alignright | removeformat',
                        themes: "modern",
                        theme_url: '/tinymce/theme/theme.min.js',
                        skin_url: '/tinymce/skin/lightgray/',
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
