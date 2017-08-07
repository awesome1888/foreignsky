import React from 'react';
// import PropTypes from 'prop-types';
import {FlowRouter} from 'meteor/kadira:flow-router';
import Form from '../form/form.jsx';

/**
 * The basic component for making forms: schema renderer
 * @abstract
 */
export default class EntityForm extends Form
{
    constructor(props)
    {
        super(props);
        this.setTitle(`New ${this.getEntityTitle()}`);
    }

    getEntity()
    {
        throw new Error('Not implemented');
    }

    getMap()
    {
        return this.getEntity().getMap();
    }

    getEntityTitle()
    {
        return this.getEntity().getTitle();
    }

    setTitleAfterDataLoad(item)
    {
    }

    async getModel()
    {
        const id = this.props.id;

        if (_.isStringNotEmpty(id)) {
            const item = await this.getEntity().findById(id, {select: '*'});
            if (item)
            {
                this.setTitleAfterDataLoad(item);
                return item.getData();
            }
            else
            {
                this.setState({
                    error: 'Element not found'
                });
            }
        }

        return {};
    }

    onSubmit(model)
    {
        const sourceModel = this.transformModelBack();

        // on submit we try save
        console.dir('save');
        console.dir(sourceModel);
    }
}
