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
    getEntity()
    {
        throw new Error('Not implemented');
    }

    getMap()
    {
        return this.getEntity().getMap().clone();
    }

    getItemTitle(item)
    {
        return 'untitled';
    }

    setTitle(item)
    {
        let title = 'new item';
        if (item)
        {
            const itemTitle = this.getItemTitle(item);
            if (_.isStringNotEmpty(itemTitle))
            {
                title = itemTitle;
            }
            else
            {
                title = 'untitled';
            }
        }
        super.setTitle(`${this.getEntity().getTitle()}: ${title}`);
    }

    async getModel()
    {
        const id = this.props.id;

        if (_.isStringNotEmpty(id) && id !== '0') {
            const item = await this.getEntity().findById(id, {select: '*'});
            if (item)
            {
                this.setTitle(item);
                return item.getData();
            }
            else
            {
                this.setState({
                    error: 'element not found',
                });
            }
        }

        this.setTitle();

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
