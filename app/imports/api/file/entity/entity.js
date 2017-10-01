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

    static convertToUrl(path)
    {
        if (!_.isStringNotEmpty(path))
        {
            return '';
        }
        return path.replace(/^public/i, '');
    }

    getPath()
    {
        return this.getData().path || '';
    }
};

export default M;
