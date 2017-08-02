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
        return (
            <div>
                {
                    this.props.children
                }
                {
                    this.hasError()
                    &&
                    <div className="form__error">{this.getErrorMessage()}</div>
                }
            </div>
        );
    }
}
