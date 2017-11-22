import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import TinyMCE from 'react-tinymce';

// dont remove the following, this are being implicitly used
import tinymce from 'tinymce';
// tinymce theme
import modern from 'tinymce/themes/modern';
// tinymce plugins
import link from 'tinymce/plugins/link';
import textcolor from 'tinymce/plugins/textcolor';
import colorpicker from 'tinymce/plugins/colorpicker';
import image from 'tinymce/plugins/image';
import code from 'tinymce/plugins/code';
import lists from 'tinymce/plugins/lists';

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
                <div className="border-r">
                    <TinyMCE
                        content={this.getValue()}
                        className="tinymce-deface"
                        config={{
                            plugins: 'link colorpicker textcolor image code lists',
                            // plugins: 'print preview fullpage powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount tinymcespellchecker a11ychecker imagetools mediaembed  linkchecker contextmenu colorpicker textpattern help',
                            toolbar: 'undo redo | bold italic forecolor backcolor | numlist bullist | removeformat',
                            // toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
                            themes: "modern",
                            // theme_url: '/tinymce/theme/theme.min.js',
                            skin_url: '/tinymce/skin/lightgray/',
                            height: 300,
                        }}
                        onChange={this.onContentChange.bind(this)}
                    />
                </div>

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
