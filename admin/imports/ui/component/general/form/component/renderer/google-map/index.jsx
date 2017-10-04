import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';
import GoogleMap from '../../../../etc/google-map/index.jsx';

class RendererGoogleMap extends RendererGeneric
{
    render()
    {
        const value = this.getValue() || {};

        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <div className="">
                    <GoogleMap
                        center={
                            _.isObjectNotEmpty(value)
                            ?
                            {lat: value.latitude, lng: value.longitude}
                            :
                            {lat: 52.522422, lng: 13.413324}
                        }
                        markers={
                            _.isObjectNotEmpty(value)
                            ?
                            [{
                                code: 'main',
                                location: {lat: value.latitude, lng: value.longitude}
                            }]
                            :
                            []
                        }
                    />
                </div>

                <input
                    type="hidden"
                    name={`${this.getName()}.latitude`}
                    value={value.latitude}
                />
                <input
                    type="hidden"
                    name={`${this.getName()}.longitude`}
                    value={value.longitude}
                />
            </Container>
        );
    }
}

export default connectField(RendererGoogleMap, {});
