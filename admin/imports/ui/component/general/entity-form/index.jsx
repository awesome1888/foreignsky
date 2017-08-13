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

        if (_.isStringNotEmpty(id) && id !== '0') {
            const item = await this.getEntity().findById(id, {select: '*'});
            if (item)
            {
                this.setTitleAfterDataLoad(item);
                return item.getData();
            }
            else
            {
                this.setState({
                    error: 'element not found',
                });
            }
        }

        return {};
    }

    async save(model)
    {
        let id = this.props.id;
        if (id === '0')
        {
            id = null;
        }

        return this.getEntity().save(id, model);
    }

    onSubmit(model)
    {
        this.save(super.onSubmit(model)).then((res) => {
            if (_.isStringNotEmpty(this.props.backPath))
            {
                // todo: transfer modified item _id somehow, to highlight in the list
                FlowRouter.go(this.props.backPath);
            }
        }, (error) => {
            this.setState({
                error: `save failed: ${error}`,
            });
        });
    }
}
