import React from 'react';
// import filterDOMProps from 'uniforms/filterDOMProps';

import RendererGeneric from '../generic/index.jsx';

import { Form } from 'semantic-ui-react'

export default class RendererGroup extends RendererGeneric
{
    render()
    {
        const a = this.getAttribute();
        if (!a)
        {
            return ('Error: no attribute passed');
        }

        const form = this.getForm();
        const row = this.getRow();
        let subAttribute;

        return (
            <Form.Group>
                {
                    a.getAttributes().map((child) => {
                        subAttribute = form.getMap().getAttribute(child.code);
                        if (!subAttribute)
                        {
                            return null;
                        }

                        return row.renderAttribute(subAttribute, {
                            className: child.size ? `${child.size} wide` : '',
                        });
                    })
                }
            </Form.Group>
        );
    }
}
