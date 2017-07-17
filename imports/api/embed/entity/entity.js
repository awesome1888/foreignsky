import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class Embed extends superclass
{
    static get collection()
    {
        return Collection;
    }

    /**
     * Converts flat options structure into tree-based
     * @param options
     * @returns {{}}
     */
    static unpackOptions(options)
    {
        const result = {};

        if(_.isArrayNotEmpty(options))
        {
            options.forEach((item) => {
                if (_.isObjectNotEmpty(item))
                {
                    result[item.key] = item.value;
                }
            });
        }

        return result;
    }

    /**
     * Converts tree-based options structure into flat
     * @param options
     * @return {{}}
     */
    static packOptions(options)
    {
        return this.flatten(options);
    }
};

export default M;
