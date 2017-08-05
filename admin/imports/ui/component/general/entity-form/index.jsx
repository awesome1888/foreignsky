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
    constructor()
    {
        super();
        this.setTitle(`New ${this.getEntity().getTitle()}`);
    }

    getEntity()
    {
        throw new Error('Not implemented');
    }

    getMap()
    {
        return this.getEntity().getMap();
    }

    async getModel()
    {
        const id = this.props.id;

        // if (_.isStringNotEmpty(id)) {
        //     return this.getEntity().findOne(id);
        // }

        return {};
    }

    onSubmit(model)
    {
        const sourceModel = this.transformModelBack();

        // on submit we try save
        console.dir('save');
        console.dir(sourceModel);
    }
    
    // getMap()
    // {
    //     if (!this._cache.map)
    //     {
    //         this._cache.map = this.declareMap();
    //         this._cache.mapIndex = this._cache.map.reduce((result, attribute) => {
    //             result[attribute.code] = attribute;
    //             return result;
    //         }, {});
    //     }
    //
    //     return this._cache.map;
    // }
    //
    // /**
    //  * Use this function to make hooks
    //  * @returns {*}
    //  */
    // declareMap()
    // {
    //     return this.readMap();
    // }
    //
    // readMap(chosenFields = null)
    // {
    //     let attributes = this.getEntity().getAttributes();
    //     if (_.isObjectNotEmpty(chosenFields))
    //     {
    //         attributes = attributes.filter(attribute => attribute.code in chosenFields);
    //     }
    //     else
    //     {
    //         chosenFields = {};
    //     }
    //
    //     return attributes.map((attribute) => {
    //         const copy = clone(attribute, false);
    //         if (copy.code in chosenFields && _.isObject(chosenFields[copy]))
    //         {
    //             Object.assign(copy, _.intersectKeys(chosenFields[copy], {
    //                 renderer: 1,
    //             }));
    //         }
    //
    //         return copy;
    //     });
    // }
}
