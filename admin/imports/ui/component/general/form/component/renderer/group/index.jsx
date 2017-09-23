import React from 'react';
// import filterDOMProps from 'uniforms/filterDOMProps';

import RendererGeneric from '../generic/index.jsx';

// import { Form } from 'semantic-ui-react';
import { Button, Checkbox, Form, Input, Radio, Select, TextArea } from 'semantic-ui-react'

export default class RendererGroup extends RendererGeneric
{
    render()
    {
        const a = this.getAttribute();
        if (!a)
        {
            return ('Error: no attribute passed');
        }

        console.dir('=== rendering group '+a.getCode()+' ============================');
        const form = this.getForm();
        const row = this.getRow();
        let subAttribute;

        return (
            <Form.Group widths='equal'>
                {
                    a.getAttributes().map((child) => {
                        subAttribute = form.getMap().getAttribute(child.code);
                        if (!subAttribute)
                        {
                            return null;
                        }

                        console.dir('to render:');
                        console.dir(subAttribute.getCode());

                        return row.renderAttribute(subAttribute);
                    })
                }
            </Form.Group>
        );
    }
}
