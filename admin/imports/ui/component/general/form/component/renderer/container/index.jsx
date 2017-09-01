import React from 'react';

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

    render()
    {
        const hasError = this.hasError();

        return (
            <div className={hasError ? 'form__container_error' : ''}>
                {
                    this.props.children
                }
                {
                    hasError
                    &&
                    <div className="form__error">{this.getErrorMessage()}</div>
                }
            </div>
        );
    }
}
