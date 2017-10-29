import Collection from '../config/collection.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class File extends superclass
{
    static getCollectionInstance()
    {
        return Collection;
    }

    /**
     * @deprecated
     * @param path
     * @returns {string}
     */
    static convertToUrl(path)
    {
        if (!_.isStringNotEmpty(path))
        {
            return '';
        }
        return path.replace(/^public/i, '');
    }

    getUrl()
    {
        return this.getData().url || this.getData().path || '';
    }

    /**
     * @deprecated
     * @returns {*}
     */
    getPath()
    {
        return this.getUrl();
    }

    /**
     * @deprecated
     * @returns {*}
     */
    getPathTo()
    {
        return this.getAbsoluteUrl();
    }
};

export default M;
