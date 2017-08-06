import React from 'react';
//import ValidatedForm from 'uniforms-unstyled/ValidatedForm';
import AutoForm from 'uniforms-unstyled/AutoForm';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import BaseComponent from '../../../../lib/base/component/component.jsx';

import Row from './component/row/index.jsx';

import './style.less';

/**
 * The basic component for making forms: schema renderer
 * @abstract
 */
export default class Form extends BaseComponent
{
    static propTypes = {
        className: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object,
        ]),
        map: PropTypes.array,
        model: PropTypes.object,
    };

    static defaultProps = {
        className: '',
        map: [],
        model: {},
    };

    constructor(props)
    {
        super(props);
        this.extendState({
            model: null,
            error: null,
        });
    }

    componentDidMount()
    {
        this.getModel().then((
            model
        ) => {
            this.setState({
                model
            });
        }, (error) => {
            console.error(error);
            this.setState(error);
        });
    }

    getMap()
    {
        return this.props.map || [];
    }

    async getModel()
    {
        return this.props.model || {};
    }

    transformMap(map)
    {
        return map;
    }

    transformModel()
    {
        return this.state.model;
    }

    transformModelBack(model)
    {
        return model;
    }

    getMapTransformed()
    {
        if (!this._cache.map)
        {
            this._cache.map = this.transformMap(this.getMap());
        }

        return this._cache.map;
    }

    /**
     * Creates surrogate schema suitable for AutoForm on the
     * basis of getMap() result
     * @returns {*}
     */
    makeSurrogateSchema()
    {
        const map = this.getMapTransformed();

        // console.dir('map');
        // console.dir(map);

        const schema = new SimpleSchema(map.reduce((result, item) => {

            result[item.code] = _.intersectKeys(item, {
                type: 1, label: 1, defaultValue: 1,
                optional: 1, allowedValues: 1,
            });

            return result;
        }, {}));

        // console.dir(schema);

        return schema;
    }

    onSubmit(model)
    {
        const sourceModel = this.transformModelBack();

        if (_.isFunction(this.props.onSubmit)) {
            this.props.onSubmit(sourceModel);
        }

        return sourceModel;
    }

    render()
    {
        const model = this.state.model;
        if (model === null)
        {
            if (this.state.error !== null)
            {
                // woops
                return (<span>Error occurred</span>);
            }

            // probably the model is still loading
            return (<span>Loading...</span>);
        }
        
        return (
            <AutoForm
                schema={this.makeSurrogateSchema()}
                model={this.transformModel()}
                onSubmit={this.onSubmit.bind(this)}
                className="form"
            >
                <div className="form__block">
                    <div className="form__block-inner">
                        {
                            _.map(this.getMapTransformed(), (attribute) => {
                                return (
                                    <Row
                                        key={attribute.code}
                                        attribute={attribute}
                                    />
                                );
                            })
                        }
                    </div>
                </div>

                <div style={{marginTop: '10px'}}>
                    <button type="submit">Send</button>
                </div>
            </AutoForm>
        );
    }
}
