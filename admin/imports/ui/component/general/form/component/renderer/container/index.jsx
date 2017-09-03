import React from 'react';

import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class Container extends React.Component
{
    static propTypes = {
        showLabel: PropTypes.bool,
    };

    static defaultProps = {
        showLabel: true,
    };

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

    showLabel()
    {
        const a = this.getAttribute();
        if (a && a.hasParameter('show-label'))
        {
            return a.getParameter('show-label') !== false;
        }

        return !!this.props.showLabel;
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
                    this.showLabel()
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
