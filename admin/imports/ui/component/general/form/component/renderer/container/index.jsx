import React from 'react';

import { Form } from 'semantic-ui-react';

export default class Container extends React.Component
{
    hasError()
    {
        return _.isObject(this.props.errorProps.error);
    }

    getErrorMessage()
    {
        return this.props.errorProps.errorMessage;
    }

    getAttribute()
    {
        return this.props.attribute || null;
    }

    renderLabel()
    {
        return this.getAttribute().getTitle() || '';
    }

    render()
    {
        const hasError = this.hasError();
        
        const className = ['form__row'];
        if (hasError)
        {
            className.push('form__container_error');
        }

        return (
            <Form.Field className={className.join(' ')} error={hasError}>
                {
                    this.getAttribute().getParameter('show-label') !== false
                    &&
                    <label>{this.renderLabel()}</label>
                }
                {
                    this.props.children
                }
                {
                    hasError
                    &&
                    <div className="form__error">{this.getErrorMessage()}</div>
                }
            </Form.Field>
        );
    }
}
