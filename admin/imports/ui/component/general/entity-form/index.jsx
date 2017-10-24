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
    static getEntity()
    {
        throw new Error('Not implemented');
    }

    getEntity()
    {
        return this.constructor.getEntity();
    }

    getMap()
    {
        return this.getEntity().getMap().filter((a) => {
            // show only auto-selectable attributes
            return a.isAutoSelectable();
        });
    }

    getItemTitle(item)
    {
        return 'untitled';
    }

    setTitle(item)
    {
        let title = 'new';
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

    getItemId()
    {
        return this.props.id;
    }

    isNewItem()
    {
        return !this.getItemId() || this.getItemId().toString() === '0';
    }

    async getModel()
    {
        const id = this.getItemId();

        if (_.isStringNotEmpty(id) && id !== '0')
        {
            return new Promise((resolve, reject) => {

                // wait for the data, tell the app to show the loader, if any
                this.getApplication().wait(
                    this.getEntity().findById(id, {select: '#'})
                ).then((item) => {
                    if (item)
                    {
                        this.setTitle(item);
                        resolve(item.getData());
                    }
                    else
                    {
                        this.setState({
                            error: 'element not found',
                        });
                        resolve({});
                    }
                }, (err) => {
                    this.setState({
                        error: err && err.reason ? err.reason : 'error occurred',
                    });
                    resolve({});
                });
            });
        }

        this.setTitle();

        return {};
    }

    async save(model)
    {
        let id = this.getItemId();
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
