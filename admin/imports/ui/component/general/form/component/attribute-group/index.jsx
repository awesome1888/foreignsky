import Renderer from '../renderer/group/index.jsx';

// import PropTypes from 'prop-types';

export default class AttributeGroup
{
    _data = null;
    _parameters = null;

    constructor(data)
    {
        this._data = this.check(data);
        this.setParameter('renderer', Renderer);
    }

    isAttribute()
    {
        return false;
    }

    getCode()
    {
        // todo: generate code from codes of grouped fields
        return 'group__'+Object.keys(this.getAttributeCodesObject()).join('_');
    }

    getData()
    {
        return this._data;
    }

    getTitle()
    {
        return this._data.title || '';
    }

    getAttributeCodesObject()
    {
        return this._data.attributes.reduce((result, attribute) => {
            result[attribute.code] = true;
            return result;
        }, {});
    }

    clone()
    {
        // todo: copy parameters?
        return new this.constructor(this._data);
    }

    hasParameter(name)
    {
        return this._parameters && name in this._parameters;
    }

    setParameter(name, value)
    {
        if (!_.isStringNotEmpty(name))
        {
            return;
        }

        if (this._parameters === null)
        {
            this._parameters = {};
        }

        this._parameters[name] = value;
    }

    getParameter(name)
    {
        if (!_.isObject(this._parameters))
        {
            return null;
        }

        if (!(name in this._parameters))
        {
            return null;
        }

        return this._parameters[name];
    }

    check(data)
    {
        if (!_.isArrayNotEmpty(data.attributes))
        {
            data.attributes = [];
        }

        return data;
    }

    getAttributes()
    {
        return this._data.attributes.map((attribute) => {
            if (!_.isStringNotEmpty(attribute.code))
            {
                return null;
            }
            return {
                code: attribute.code,
                size: attribute.size,
            };
        });
    }
}
