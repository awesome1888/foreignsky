import React from 'react';
import connectField from 'uniforms/connectField';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

class StringAttribute extends React.Component
{
    render()
    {
        console.dir(this.props);

        return (
            <div className="field__container">
                <input
                    type="text"
                    name={this.props.name}
                    onChange={event => this.props.onChange(event.target.value)}
                    value={this.props.value}
                />
                <div>Error: {this.props.error}</div>
            </div>
        );
    }
}

export default connectField(StringAttribute, {});
